import React from 'react';
import { useLocation, useParams, Navigate, useNavigate } from 'react-router-dom';
import { push, ref, serverTimestamp, set } from 'firebase/database';
import { useAuth } from '../auth';
import { database } from '../firebase';
import { findModuleByLabel, findModuleByPath, modules } from '../modules';
import { UserRole } from '../App';

interface ScreenShellProps {
  userRole: UserRole;
}

const ScreenShell: React.FC<ScreenShellProps> = ({ userRole }) => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, signInWithGoogle } = useAuth();
  const module = modules.find((m) => m.id === moduleId);

  // Permission check
  const hasPermission = module && (
    userRole === 'Admin' || 
    module.category === 'User'
  );

  if (!module || !hasPermission) {
    return <Navigate to="/" replace />;
  }

  if (module.id === 'cart_checkout' && !user) {
    return <Navigate to={`/login?returnTo=${encodeURIComponent(location.pathname)}`} replace />;
  }

  const prepareIframeNavigation = (e: React.SyntheticEvent<HTMLIFrameElement>) => {
    try {
      const iframe = e.currentTarget;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (iframeDoc) {
        const style = iframeDoc.createElement('style');
        style.textContent = `
          header, nav:not(.internal-nav) { display: none !important; }
          body { padding-top: 0 !important; }
          .layout-container { padding-top: 0 !important; }
        `;
        iframeDoc.head.appendChild(style);

        if (module.id === 'cart_checkout') {
          const defaultAddress = profile?.addresses.find((address) => address.isDefault) || profile?.addresses[0];
          const setValue = (id: string, value = '') => {
            const field = iframeDoc.getElementById(id) as HTMLInputElement | HTMLSelectElement | null;
            if (field && !field.value) field.value = value;
          };
          const proceedButton = Array
            .from(iframeDoc.querySelectorAll('button'))
            .find((button) => button.textContent?.toLowerCase().includes('proceed to payment')) as HTMLButtonElement | undefined;
          const policyCheckbox = iframeDoc.querySelector('input[type="checkbox"]') as HTMLInputElement | null;
          const googleButton = Array
            .from(iframeDoc.querySelectorAll('button'))
            .find((button) => button.textContent?.toLowerCase().includes('sign in with google')) as HTMLButtonElement | undefined;

          setValue('email', profile?.email || user?.email || '');
          setValue('firstName', defaultAddress?.firstName || profile?.displayName?.split(' ')[0] || '');
          setValue('lastName', defaultAddress?.lastName || profile?.displayName?.split(' ').slice(1).join(' ') || '');
          setValue('address', defaultAddress?.street || '');
          setValue('apartment', defaultAddress?.apartment || '');
          setValue('city', defaultAddress?.city || '');
          setValue('state', defaultAddress?.state || '');
          setValue('zip', defaultAddress?.zip || '');
          setValue('phone', defaultAddress?.phone || profile?.phone || '');

          if (googleButton) {
            googleButton.textContent = profile ? `Signed in as ${profile.email}` : 'Sign in with Google';
          }

          const syncProceedState = () => {
            if (!proceedButton || !policyCheckbox) return;
            proceedButton.style.opacity = policyCheckbox.checked ? '1' : '0.5';
            proceedButton.style.cursor = policyCheckbox.checked ? 'pointer' : 'not-allowed';
          };

          syncProceedState();
          policyCheckbox?.addEventListener('change', syncProceedState);
        }

        iframeDoc.addEventListener('click', (clickEvent) => {
          const target = clickEvent.target;
          if (!(target instanceof iframeDoc.defaultView!.Element)) return;

          const anchor = target.closest('a[href]');
          if (anchor instanceof iframeDoc.defaultView!.HTMLAnchorElement) {
            const href = anchor.getAttribute('href') || '';
            const linkedModule = href === '/'
              ? modules.find((item) => item.id === 'homepage')
              : findModuleByPath(anchor.href) || findModuleByPath(href) || findModuleByLabel(anchor.textContent || '');

            if (linkedModule) {
              clickEvent.preventDefault();
              navigate(`/view/${linkedModule.id}`);
            }
          }

          const button = target.closest('button');
          if (button instanceof iframeDoc.defaultView!.HTMLButtonElement) {
            const label = button.textContent || '';
            const linkedModule = findModuleByLabel(label);

            if (label.toLowerCase().includes('sign in with google')) {
              clickEvent.preventDefault();
              signInWithGoogle();
              return;
            }

            if (module.id === 'cart_checkout' && label.toLowerCase().includes('proceed to payment')) {
              clickEvent.preventDefault();
              submitCheckout(iframeDoc);
              return;
            }

            if (linkedModule) {
              clickEvent.preventDefault();
              navigate(`/view/${linkedModule.id}`);
            }
          }
        });
      }
    } catch (err) {
      console.warn('Could not hide iframe header due to cross-origin restrictions or other error:', err);
    }
  };

  const submitCheckout = async (iframeDoc: Document) => {
    if (!user) {
      navigate(`/login?returnTo=${encodeURIComponent(location.pathname)}`);
      return;
    }
    if (!database) {
      iframeDoc.defaultView?.alert('Firebase Database is not configured. Add a valid VITE_FIREBASE_API_KEY and restart the dev server.');
      return;
    }

    const readField = (id: string) => (iframeDoc.getElementById(id) as HTMLInputElement | HTMLSelectElement | null)?.value.trim() || '';
    const policyAccepted = (iframeDoc.querySelector('input[type="checkbox"]') as HTMLInputElement | null)?.checked;
    const address = {
      email: readField('email'),
      firstName: readField('firstName'),
      lastName: readField('lastName'),
      street: readField('address'),
      apartment: readField('apartment'),
      city: readField('city'),
      state: readField('state'),
      zip: readField('zip'),
      phone: readField('phone'),
    };

    const requiredFields = ['email', 'firstName', 'lastName', 'street', 'city', 'state', 'zip', 'phone'] as const;
    const missingField = requiredFields.find((field) => !address[field]);

    if (missingField) {
      iframeDoc.defaultView?.alert('Please complete your contact and shipping address before payment.');
      return;
    }

    if (!policyAccepted) {
      iframeDoc.defaultView?.alert('Please acknowledge the No Returns and No Cancellation policy before payment.');
      return;
    }

    const orderRef = push(ref(database, 'orders'));
    const orderId = orderRef.key || crypto.randomUUID();
    const order = {
      id: orderId,
      userId: user.uid,
      customer: {
        name: `${address.firstName} ${address.lastName}`.trim(),
        email: address.email,
        phone: address.phone,
      },
      shippingAddress: address,
      notificationPreferences: profile?.notifications || {
        sms: true,
        whatsapp: true,
        browser: false,
      },
      policyAccepted,
      status: 'payment_pending',
      currency: 'INR',
      total: 335,
      items: [
        { name: 'Premium Lawn Suit', quantity: 1, price: 250 },
        { name: 'Artisanal Dupatta', quantity: 1, price: 85 },
      ],
      createdAt: serverTimestamp(),
    };

    try {
      await set(orderRef, order);
      await set(ref(database, `users/${user.uid}/orders/${orderId}`), order);
      await set(ref(database, `users/${user.uid}/checkout/latest`), order);
      iframeDoc.defaultView?.alert('Checkout saved. Payment integration can now use this order record.');
    } catch (checkoutError) {
      console.warn('Unable to save checkout:', checkoutError);
      iframeDoc.defaultView?.alert('Could not save checkout. Please check Firebase database rules and try again.');
    }
  };

  return (
    <div style={styles.container}>
      {module.category !== 'User' && (
        <header style={styles.header}>
          <h2 style={styles.title}>{module.name}</h2>
          <div style={styles.badge}>{module.category}</div>
        </header>
      )}
      <div style={styles.iframeWrapper}>
        <iframe
          src={module.path}
          style={styles.iframe}
          title={module.name}
          frameBorder="0"
          onLoad={prepareIframeNavigation}
        />
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'var(--color-background)',
  },
  header: {
    padding: '12px 16px',
    backgroundColor: 'var(--color-white)',
    borderBottom: '1px solid var(--color-graceful-blush)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: '60px', // Space for mobile menu toggle
  },
  title: {
    fontSize: '16px',
    margin: 0,
    color: 'var(--color-rich-berry)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '180px',
    fontFamily: 'var(--font-serif)',
  },
  badge: {
    fontSize: '10px',
    padding: '4px 12px',
    borderRadius: '12px',
    backgroundColor: 'var(--color-graceful-blush)',
    color: 'var(--color-rich-berry)',
    fontWeight: '600',
    textTransform: 'uppercase',
    fontFamily: 'var(--font-sans)',
  },
  iframeWrapper: {
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  iframe: {
    width: '100%',
    height: '100%',
    border: 'none',
  },
};

export default ScreenShell;
