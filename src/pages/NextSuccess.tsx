import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NextSuccess() {
const navigate = useNavigate();
return (
<div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-6">
<h1 className="text-4xl font-black text-cyan-400">Em Desenvolvimento</h1>
<Button onClick={() => navigate("/")} variant="outline" className="text-black">Voltar para a Home</Button>
</div>
);
}