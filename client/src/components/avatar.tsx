const Avatar =  ({ name, src, size = 40 }: {name: string; src?: string; size: number}): React.JSX.Element => {
    const initials = name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();

      const randomColor = () => {
        const colors = [
          "#F44336", "#E91E63", "#9C27B0", "#3F51B5", "#2196F3",
          "#03A9F4", "#009688", "#4CAF50", "#FFC107", "#FF5722"
        ];
        // Simple hash for consistent color per name
        const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return colors[hash % colors.length];
      };
  
    const style = {
      width: size,
      height: size,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "bold",
      backgroundColor: randomColor(),
      color: "#fff",
      fontSize: size * 0.4,
      objectFit: "cover" as React.CSSProperties['objectFit'],
    };
  
    return src ? (
      <img src={src} alt={name} style={style} />
    ) : (
      <div style={style}>{initials}</div>
    );
  }
  

export default Avatar;