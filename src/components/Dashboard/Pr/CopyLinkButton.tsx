import React, { useState, useEffect } from "react";
import {Button} from "@/components/ui/Button";
import { ClipboardCopy, CheckCircle } from "lucide-react";
import { jwtDecode, JwtPayload } from "jwt-decode";

interface CustomJwtPayload extends JwtPayload {
  pr_id?: string;
}

const CopyLinkButton = () => {
  const [copied, setCopied] = useState(false);
  const [prId, setPrId] = useState<string | null>(null);

  useEffect(() => {
    const getPrIdFromToken = (): string | null => {
      try {
        const cookies = document.cookie.split("; ");
        const tokenCookie = cookies.find((row) => row.startsWith("token="));
        if (!tokenCookie) return null;

        const token = tokenCookie.split("=")[1];
        const decoded = jwtDecode<CustomJwtPayload>(token);
        return decoded.pr_id || null;
      } catch (error) {
        console.error("Errore nella decodifica del token:", error);
        return null;
      }
    };

    setPrId(getPrIdFromToken());
  }, []);

  const copyToClipboard = async () => {
    if (!prId) return;

    try {
      await navigator.clipboard.writeText(`${window.location.origin}/lista?pr_id=${prId}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Errore nella copia negli appunti", err);
    }
  };

  return (
    <div className="w-full flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center w-full md:w-auto">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">Condividi il tuo link</h3>
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
