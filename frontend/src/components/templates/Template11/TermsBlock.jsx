const TermsBlock = ({ terms }) => {
  return (
    <div style={{ width: 300 }}>
      <b>Terms & Conditions</b>
      {terms.map((t, i) => (
        <p key={i}>• {t}</p>
      ))}
    </div>
  );
};

export default TermsBlock;
