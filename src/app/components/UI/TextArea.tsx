type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export default function TextArea(props: Props) {
  return (
    <textarea
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
