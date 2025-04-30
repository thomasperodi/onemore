"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ClipboardCopy, CheckCircle } from "lucide-react";

interface CopyLinkButtonProps {
  eventoId: number;
  prId: string | null;
}

const CopyLinkButton = ({ eventoId, prId }: CopyLinkButtonProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    if (!prId || !eventoId) return;

    const link = `https://www.onemoreandfam.it/lista/${eventoId}?id_pr=${prId}`;

    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Errore nella copia negli appunti", err);
    }
  };

  return (
    <div className="w-full flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center w-full md:w-auto">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">
          Condividi il tuo link
        </h3>
        <Button
          aria-disabled={!prId}
          onClick={prId ? copyToClipboard : undefined}
          className={`w-full flex items-center justify-center gap-2 transition-all duration-300 ${
            copied ? "bg-green-500 hover:bg-green-600" : ""
          }`}
        >
          {copied ? <CheckCircle size={18} /> : <ClipboardCopy size={18} />}
          {copied ? "Copiato!" : "Copia Link"}
        </Button>
      </div>
    </div>
  );
};

export default CopyLinkButton;
