interface FilePathDisplayProps {
  text: string;
  className?: string;
}

export function FilePathDisplay({ text, className = '' }: FilePathDisplayProps) {
  if (!text) return null;

  return (
    <div className={`inline-flex items-center text-xs ${className}`}>
      <div className="">
        <span>Component file path: </span>
        <span className="inline-flex items-center px-2 py-1 rounded border border-layerzero-gray-600 bg-layerzero-gray-800 font-mono text-layerzero-white break-all">{text}</span>
      </div>
    </div>
  );
}


