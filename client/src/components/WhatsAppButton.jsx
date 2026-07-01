export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/265000000000"
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: '50%',
        background: '#25D366',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 6px 24px rgba(0,0,0,0.4)',
        zIndex: 60,
        fontSize: '1.6rem'
      }}
    >
      💬
    </a>
  );
}
