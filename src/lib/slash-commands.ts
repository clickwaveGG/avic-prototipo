/**
 * Slash commands do Avicena.
 * Cada comando expande o input do usuário em um prompt estruturado
 * que o Hipócrates sabe interpretar e responder no formato correto.
 */

export type SlashCommandId =
  | "/resumir"
  | "/explicar"
  | "/quizar"
  | "/caso"
  | "/diferenciar"
  | "/dose";

type SlashCommandDef = {
  id: SlashCommandId;
  systemHint: string;
};

const COMMANDS: SlashCommandDef[] = [
  {
    id: "/resumir",
    systemHint: `O estudante pediu um RESUMO. Estruture assim:
1. Visão geral (2-3 frases)
2. Pontos-chave em bullets
3. "Cai na prova" — o que examinadores cobram
4. Se houver códice anexado, cite páginas exatas.
Seja conciso. Máximo 400 palavras.`,
  },
  {
    id: "/explicar",
    systemHint: `O estudante pediu uma EXPLICAÇÃO DETALHADA. Estruture assim:
1. Mecanismo fisiopatológico (passo a passo)
2. Manifestações clínicas associadas
3. Correlação clínico-laboratorial
4. "Ângulo prova" — como esse tema aparece em Revalida/ENARE
Se houver códice anexado, cite páginas exatas.`,
  },
  {
    id: "/quizar",
    systemHint: `O estudante pediu um QUIZ. Gere exatamente 5 questões:
- Formato: questão objetiva com 5 alternativas (A-E)
- Estilo: Revalida / ENARE / provas de residência
- Após as 5 questões, forneça o GABARITO COMENTADO de cada uma
- Dificuldade progressiva (fácil → difícil)
- Se houver códice anexado, baseie as questões no conteúdo do códice e cite páginas.
Formato markdown com separadores claros entre questões.`,
  },
  {
    id: "/caso",
    systemHint: `O estudante pediu um CASO CLÍNICO SIMULADO. Estruture assim:
1. **Identificação:** idade, sexo, profissão
2. **Queixa principal e HDA:** tempo de evolução, sintomas
3. **Exame físico:** achados relevantes
4. **Exames complementares:** resultados
5. **Perguntas para raciocínio:**
   - Qual o diagnóstico mais provável?
   - Quais diferenciais considerar?
   - Qual a conduta inicial?
Lembre: "raciocínio diagnóstico", nunca "diagnóstico" isolado. Caso simulado pedagógico.`,
  },
  {
    id: "/diferenciar",
    systemHint: `O estudante pediu uma TABELA COMPARATIVA. Estruture assim:
- Tabela markdown com colunas lado a lado
- Critérios de comparação: definição, fisiopatologia, quadro clínico, diagnóstico, tratamento
- Destaque as diferenças-chave em **negrito**
- Ao final, "Dica de prova" — como diferenciar rapidamente
Se houver códice, cite páginas de referência.`,
  },
  {
    id: "/dose",
    systemHint: `O estudante perguntou sobre FARMACOLOGIA. Estruture assim:
1. Classe farmacológica e mecanismo de ação
2. Indicações principais
3. Posologia padrão (faixa terapêutica)
4. Ajustes (renal, hepático, idoso)
5. Contraindicações e interações importantes
6. Efeitos adversos relevantes
OBRIGATÓRIO: "Consulte a bula oficial e o prescritor responsável. Material de estudo."`,
  },
];

const COMMAND_MAP = new Map(COMMANDS.map((c) => [c.id, c]));

/**
 * Detecta se uma mensagem começa com um slash command.
 * Retorna o comando e o texto restante (o "tema" do pedido).
 */
export function parseSlashCommand(input: string): {
  command: SlashCommandDef | null;
  topic: string;
} {
  const trimmed = input.trim();
  for (const cmd of COMMANDS) {
    if (trimmed.startsWith(cmd.id)) {
      const topic = trimmed.slice(cmd.id.length).trim();
      return { command: cmd, topic };
    }
  }
  return { command: null, topic: trimmed };
}

/**
 * Expande o input do usuário com o prompt do slash command.
 * Se não for um slash command, retorna o input original.
 */
export function expandSlashCommand(input: string): {
  userMessage: string;
  systemHint: string | null;
} {
  const { command, topic } = parseSlashCommand(input);
  if (!command) {
    return { userMessage: input, systemHint: null };
  }
  const userMessage = topic || `${command.id.slice(1)} sobre o assunto em discussão`;
  return { userMessage, systemHint: command.systemHint };
}

export { COMMANDS as SLASH_COMMAND_DEFS };
