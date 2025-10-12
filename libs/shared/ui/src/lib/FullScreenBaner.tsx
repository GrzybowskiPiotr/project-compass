interface FullScreenBanerProps {
  children: React.ReactNode;
}

export function FullScreenBaner({ children }: FullScreenBanerProps) {
  return (
    <div className="w-full h-full absolute left-0 top-0 flex justify-center items-center  pt-20 z-50 bg-slate-700 bg-opacity-40 backdrop-blur-md">
      <div className="bg-blue-300 bg-opacity-50 p-8 rounded-lg shadow-xl ">
        {children}
      </div>
    </div>
  );
}
