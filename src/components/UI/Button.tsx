type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button(props: Props) {
  return (
    <button
      {...props}
      style={{
        width: "100%",
        padding: 10,
        borderRadius: 6,
        background: "#0070f3",
        color: "white",
        border: "none",
        fontSize: 16,
        cursor: "pointer",
        ...props.style,
      }}
    />
  );
}
