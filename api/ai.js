// NOLATRONIC 1.5 · Backend seguro de IA (Node/serverless)
// Configura OPENAI_API_KEY como variable secreta del proveedor. Nunca la pongas en index.html.
export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'Método no permitido'});
  const question=String(req.body?.question||'').trim().slice(0,4000);
  const context=req.body?.context||{};
  if(!question) return res.status(400).json({error:'Pregunta vacía'});
  const domain=/electric|electr|rebt|itc|volt|tensi[oó]n|corriente|amper|watt|potencia|cable|secci[oó]n|magneto|diferencial|cuadro|circuit|solar|fotovolta|panel|inversor|bater[ií]a|bms|celda|electron|resisten|condens|capacitor|diod|transistor|mosfet|igbt|pcb|placa|fuente|transform|motor|rel[eé]|contactor|sensor|arduino|esp32|mult[ií]metro|osciloscopio|aver[ií]a|cortocircuit|tierra|fase|neutro|trifas|monofas|led|fusible|rectificador|microcontrolador|smps|pwm/i;
  if(!domain.test(question)) return res.json({answer:'Solo puedo atender consultas de electricidad y electrónica.'});
  if(!process.env.OPENAI_API_KEY) return res.status(503).json({error:'OPENAI_API_KEY no configurada'});
  const instructions=`Eres la IA de NOLATRONIC, un asistente técnico especializado EXCLUSIVAMENTE en electricidad y electrónica.
Ámbito permitido: instalaciones eléctricas BT, REBT español, cálculo eléctrico, cuadros y protecciones, solar fotovoltaica, almacenamiento y baterías, electrónica analógica/digital, componentes, fuentes, PCB, instrumentación, microcontroladores, motores, automatización y diagnóstico/reparación.
Si la petición no pertenece claramente a electricidad o electrónica, responde exactamente: "Solo puedo atender consultas de electricidad y electrónica."
Responde en español salvo petición técnica explícita. Sé práctico y preciso. Distingue cálculo orientativo de requisito reglamentario. No inventes artículos ni requisitos del REBT; cuando no tengas certeza, indícalo y pide verificar la fuente oficial vigente.
En trabajos eléctricos peligrosos o alta tensión, prioriza seguridad y no presentes una estimación como autorización para intervenir.`;
  const input=`Contexto local NOLATRONIC (puede estar vacío): ${JSON.stringify(context).slice(0,6000)}\n\nConsulta: ${question}`;
  try{
    const r=await fetch('https://api.openai.com/v1/responses',{method:'POST',headers:{'Authorization':'Bearer '+process.env.OPENAI_API_KEY,'Content-Type':'application/json'},body:JSON.stringify({model:process.env.OPENAI_MODEL||'gpt-5-mini',instructions,input,max_output_tokens:1200})});
    const data=await r.json();
    if(!r.ok) return res.status(r.status).json({error:data?.error?.message||'Error del proveedor de IA'});
    const answer=data.output_text || (data.output||[]).flatMap(x=>x.content||[]).filter(x=>x.type==='output_text').map(x=>x.text).join('\n') || 'Sin respuesta';
    return res.status(200).json({answer});
  }catch(e){return res.status(500).json({error:'No se pudo contactar con el servicio de IA'})}
}
