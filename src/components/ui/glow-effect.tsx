export function GlowEffect() {
  return (
    <div className="absolute inset-0 -z-10">
      <div className="absolute top-0 left-1/4 h-[300px] w-[300px] rounded-full bg-purple-500/20 blur-[100px]" />
      <div className="absolute bottom-0 right-1/4 h-[250px] w-[250px] rounded-full bg-cyan-500/20 blur-[100px]" />
    </div>
  );
}
