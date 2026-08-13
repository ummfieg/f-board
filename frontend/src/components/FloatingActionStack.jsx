function FloatingActionStack({ children }) {
  return (
    <div className="fixed bottom-8 z-30 flex flex-col items-end gap-3 [right:max(1.5rem,calc((100vw-1024px)/2+1.5rem))]">
      {children}
    </div>
  );
}

export default FloatingActionStack;
