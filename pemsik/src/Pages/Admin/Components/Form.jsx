const Form = ({
  onSubmit,
  children,
  className = "",
  noValidate = true,
  ...props
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(e);
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate={noValidate}
      className={`space-y-4 ${className}`}
      {...props}
    >
      {children}
    </form>
  );
};

export default Form;
