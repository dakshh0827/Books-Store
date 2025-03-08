const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-400 to-pink-500 p-12">
      <div className="max-w-md text-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 rounded-full bg-white/10 blur-2xl" />
          <div className="w-32 h-32 mx-auto rounded-full bg-white/30 shadow-xl" />
        </div>
        <h2 className="text-3xl font-bold mb-4 text-white">{title}</h2>
        <p className="text-white/80">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;
