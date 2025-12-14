type Props = React.InputHTMLAttributes<HTMLInputElement>;

export default function Input(props: Props) {
  return (
    <input
      {...props}
      style={{
        width: "100%",
        padding: 8,
        borderRadius: 4,
        border: "1px solid #ccc",
        fontSize: 16,
        boxSizing: "border-box",
        ...props.style,
      }}
    />
  );
}
