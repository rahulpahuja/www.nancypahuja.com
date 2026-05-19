import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, Home, LogIn, LogOut, Plus, Save, Trash2 } from 'lucide-react';
import { Address, UserProfile as Profile, useAuth } from '../auth';

const emptyAddress: Address = {
  id: '',
  label: 'Home',
  firstName: '',
  lastName: '',
  street: '',
  apartment: '',
  city: '',
  state: '',
  zip: '',
  phone: '',
  isDefault: true,
};

function createAddress(): Address {
  return {
    ...emptyAddress,
    id: crypto.randomUUID(),
  };
}

const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, loading, error, signInWithGoogle, saveProfile, saveNotificationPreferences, logout } = useAuth();
  const [draft, setDraft] = useState<Profile | null>(profile);
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (profile) {
      setDraft({
        ...profile,
        addresses: profile.addresses.length ? profile.addresses : [createAddress()],
      });
    }
  }, [profile]);

  const defaultAddress = useMemo(
    () => draft?.addresses.find((address) => address.isDefault) || draft?.addresses[0],
    [draft]
  );

  if (loading) {
    return <div style={styles.centered}>Loading profile...</div>;
  }

  if (!user || !draft) {
    return (
      <div style={styles.centered}>
        <section style={styles.authCard}>
          <h1 style={styles.title}>Sign in to manage your profile</h1>
          <p style={styles.copy}>Use Google sign-in to save delivery addresses and checkout faster.</p>
          {error && <p style={styles.error}>{error}</p>}
          <button style={styles.primaryButton} onClick={signInWithGoogle}>
            <LogIn size={18} />
            Continue with Google
          </button>
        </section>
      </div>
    );
  }

  const updateAddress = (id: string, patch: Partial<Address>) => {
    setDraft((current) => current && ({
      ...current,
      addresses: current.addresses.map((address) => (
        address.id === id ? { ...address, ...patch } : address
      )),
    }));
  };

  const setDefaultAddress = (id: string) => {
    setDraft((current) => current && ({
      ...current,
      addresses: current.addresses.map((address) => ({
        ...address,
        isDefault: address.id === id,
      })),
    }));
  };

  const removeAddress = (id: string) => {
    setDraft((current) => {
      if (!current) return current;
      const addresses = current.addresses.filter((address) => address.id !== id);
      return {
        ...current,
        addresses: addresses.length ? addresses.map((address, index) => ({ ...address, isDefault: index === 0 || address.isDefault })) : [createAddress()],
      };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setStatus('');
    try {
      await saveProfile({
        ...draft,
        addresses: draft.addresses.map((address, index) => ({
          ...address,
          isDefault: address.isDefault || index === 0,
        })),
      });
      setStatus('Profile saved.');
    } catch (saveError) {
      console.warn('Unable to save profile:', saveError);
      setStatus('Could not save profile. Please check Firebase rules and try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleNotificationSave = async () => {
    setSaving(true);
    setStatus('');
    try {
      await saveNotificationPreferences(draft.notifications);
      setStatus('Notification preferences saved.');
    } catch (notificationError) {
      console.warn('Unable to save notification preferences:', notificationError);
      setStatus('Could not save notification preferences.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    const shouldLogout = window.confirm('Are you sure you want to log out?');
    if (!shouldLogout) return;

    setIsLoggingOut(true);
    setStatus('');
    try {
      await logout();
      setDraft(null);
      navigate('/login?returnTo=/view/homepage', { replace: true });
    } catch (logoutError) {
      console.warn('Unable to sign out:', logoutError);
      setStatus('Could not sign out. Please try again.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div style={styles.page}>
      <section style={styles.header}>
        <div>
          <p style={styles.eyebrow}>Customer Profile</p>
          <h1 style={styles.title}>{draft.displayName || 'Nancy Pahuja Customer'}</h1>
          <p style={styles.copy}>{draft.email}</p>
        </div>
        <button style={styles.secondaryButton} onClick={handleLogout} disabled={isLoggingOut}>
          <LogOut size={18} />
          {isLoggingOut ? 'Signing out...' : 'Sign out'}
        </button>
      </section>

      {status && <div style={styles.status}>{status}</div>}
      {error && <div style={styles.error}>{error}</div>}

      <section style={styles.summaryBand}>
        <div>
          <p style={styles.eyebrow}>Default Delivery Address</p>
          <p style={styles.summaryText}>
            {defaultAddress?.street ? `${defaultAddress.street}, ${defaultAddress.city}, ${defaultAddress.state} ${defaultAddress.zip}` : 'Add an address to speed up checkout.'}
          </p>
        </div>
        <button style={styles.primaryButton} onClick={handleSave} disabled={saving}>
          <Save size={18} />
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </section>

      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <div>
            <p style={styles.eyebrow}>Addresses</p>
            <h2 style={styles.sectionTitle}>Delivery Details</h2>
          </div>
          <button
            style={styles.secondaryButton}
            onClick={() => setDraft({ ...draft, addresses: [...draft.addresses, createAddress()] })}
          >
            <Plus size={18} />
            Add Address
          </button>
        </div>

        <div style={styles.addressGrid}>
          {draft.addresses.map((address) => (
            <article key={address.id} style={styles.addressCard}>
              <div style={styles.cardHeader}>
                <Home size={18} />
                <input
                  style={styles.inlineInput}
                  value={address.label}
                  onChange={(event) => updateAddress(address.id, { label: event.target.value })}
                  aria-label="Address label"
                />
                {address.isDefault && <span style={styles.defaultPill}><Check size={14} /> Default</span>}
              </div>

              <div style={styles.formGrid}>
                <Input label="First Name" value={address.firstName} onChange={(value) => updateAddress(address.id, { firstName: value })} />
                <Input label="Last Name" value={address.lastName} onChange={(value) => updateAddress(address.id, { lastName: value })} />
                <Input label="Street Address" value={address.street} onChange={(value) => updateAddress(address.id, { street: value })} wide />
                <Input label="Apartment" value={address.apartment} onChange={(value) => updateAddress(address.id, { apartment: value })} wide />
                <Input label="City" value={address.city} onChange={(value) => updateAddress(address.id, { city: value })} />
                <Input label="State" value={address.state} onChange={(value) => updateAddress(address.id, { state: value })} />
                <Input label="ZIP Code" value={address.zip} onChange={(value) => updateAddress(address.id, { zip: value })} />
                <Input label="Phone" value={address.phone} onChange={(value) => updateAddress(address.id, { phone: value })} />
              </div>

              <div style={styles.cardActions}>
                <button style={styles.textButton} onClick={() => setDefaultAddress(address.id)}>Use for checkout</button>
                <button style={styles.iconDangerButton} onClick={() => removeAddress(address.id)} aria-label="Remove address">
                  <Trash2 size={16} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <div>
            <p style={styles.eyebrow}>Notifications</p>
            <h2 style={styles.sectionTitle}>Order Updates</h2>
          </div>
          <button style={styles.secondaryButton} onClick={handleNotificationSave} disabled={saving}>
            <Bell size={18} />
            Save Preferences
          </button>
        </div>
        <div style={styles.toggleRow}>
          <Toggle label="SMS" checked={draft.notifications.sms} onChange={(sms) => setDraft({ ...draft, notifications: { ...draft.notifications, sms } })} />
          <Toggle label="WhatsApp" checked={draft.notifications.whatsapp} onChange={(whatsapp) => setDraft({ ...draft, notifications: { ...draft.notifications, whatsapp } })} />
          <Toggle label="Browser Push" checked={draft.notifications.browser} onChange={(browser) => setDraft({ ...draft, notifications: { ...draft.notifications, browser } })} />
        </div>
      </section>
    </div>
  );
};

const Input: React.FC<{ label: string; value: string; onChange: (value: string) => void; wide?: boolean }> = ({ label, value, onChange, wide }) => (
  <label style={{ ...styles.field, ...(wide ? styles.wideField : null) }}>
    <span style={styles.fieldLabel}>{label}</span>
    <input style={styles.input} value={value} onChange={(event) => onChange(event.target.value)} />
  </label>
);

const Toggle: React.FC<{ label: string; checked: boolean; onChange: (checked: boolean) => void }> = ({ label, checked, onChange }) => (
  <label style={styles.toggle}>
    <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
    <span>{label}</span>
  </label>
);

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100%',
    overflowY: 'auto',
    padding: '48px clamp(20px, 5vw, 72px) 96px',
    backgroundColor: 'var(--color-background)',
  },
  centered: {
    minHeight: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px',
    backgroundColor: 'var(--color-background)',
  },
  authCard: {
    width: 'min(520px, 100%)',
    backgroundColor: 'var(--color-white)',
    border: '1px solid var(--color-graceful-blush)',
    borderRadius: 'var(--radius-md)',
    padding: '40px',
  },
  header: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: '24px',
    marginBottom: '32px',
  },
  eyebrow: {
    margin: 0,
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    color: 'var(--color-rose-gold)',
    fontWeight: 700,
  },
  title: {
    margin: '8px 0',
    fontSize: '34px',
    color: 'var(--color-rich-berry)',
  },
  copy: {
    margin: 0,
    color: 'rgba(62, 2, 23, 0.7)',
  },
  summaryBand: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '24px',
    padding: '24px',
    backgroundColor: 'var(--color-white)',
    border: '1px solid var(--color-graceful-blush)',
    borderRadius: 'var(--radius-md)',
    marginBottom: '32px',
  },
  summaryText: {
    margin: '6px 0 0',
    color: 'var(--color-rich-berry)',
    fontSize: '16px',
  },
  section: {
    marginTop: '32px',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '24px',
    marginBottom: '18px',
  },
  sectionTitle: {
    margin: '4px 0 0',
    fontSize: '24px',
  },
  addressGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '20px',
  },
  addressCard: {
    backgroundColor: 'var(--color-white)',
    border: '1px solid var(--color-graceful-blush)',
    borderRadius: 'var(--radius-md)',
    padding: '22px',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '20px',
  },
  inlineInput: {
    flex: 1,
    border: 'none',
    borderBottom: '1px solid var(--color-graceful-blush)',
    padding: '6px 0',
    color: 'var(--color-rich-berry)',
    fontWeight: 700,
    outline: 'none',
  },
  defaultPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '5px 8px',
    backgroundColor: 'var(--color-graceful-blush)',
    color: 'var(--color-rich-berry)',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: 700,
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: '14px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  wideField: {
    gridColumn: '1 / -1',
  },
  fieldLabel: {
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: 'rgba(62, 2, 23, 0.65)',
    fontWeight: 700,
  },
  input: {
    width: '100%',
    border: '1px solid var(--color-graceful-blush)',
    borderRadius: 'var(--radius-sm)',
    padding: '12px',
    color: 'var(--color-rich-berry)',
    outline: 'none',
    backgroundColor: 'var(--color-white)',
  },
  cardActions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    marginTop: '18px',
  },
  toggleRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '14px',
    backgroundColor: 'var(--color-white)',
    border: '1px solid var(--color-graceful-blush)',
    borderRadius: 'var(--radius-md)',
    padding: '22px',
  },
  toggle: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 14px',
    border: '1px solid var(--color-graceful-blush)',
    borderRadius: 'var(--radius-sm)',
  },
  primaryButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    padding: '13px 18px',
    backgroundColor: 'var(--color-rose-gold)',
    color: 'var(--color-white)',
    borderRadius: 'var(--radius-sm)',
    fontWeight: 700,
  },
  secondaryButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    padding: '12px 16px',
    backgroundColor: 'var(--color-white)',
    border: '1px solid var(--color-rich-berry)',
    color: 'var(--color-rich-berry)',
    borderRadius: 'var(--radius-sm)',
    fontWeight: 700,
  },
  textButton: {
    color: 'var(--color-rose-gold)',
    fontWeight: 700,
  },
  iconDangerButton: {
    color: 'var(--color-error, #ba1a1a)',
    padding: '8px',
  },
  status: {
    padding: '12px 16px',
    marginBottom: '18px',
    backgroundColor: 'var(--color-white)',
    border: '1px solid var(--color-graceful-blush)',
    borderRadius: 'var(--radius-sm)',
  },
  error: {
    padding: '12px 16px',
    marginBottom: '18px',
    color: '#93000a',
    backgroundColor: '#ffdad6',
    borderRadius: 'var(--radius-sm)',
  },
};

export default UserProfile;
