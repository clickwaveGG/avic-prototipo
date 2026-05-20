import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politica de Privacidade — Avicena",
  description: "Politica de privacidade da plataforma Avicena.",
};

export default function PrivacidadePage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        color: "var(--text)",
        fontFamily: "var(--font-body)",
      }}
    >
      <div
        style={{
          maxWidth: "48rem",
          margin: "0 auto",
          padding: "3rem 1.5rem",
        }}
      >
        <Link
          href="/"
          style={{
            color: "var(--primary)",
            textDecoration: "none",
            fontSize: "0.875rem",
            fontWeight: 500,
          }}
        >
          &larr; Voltar ao inicio
        </Link>

        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 700,
            marginTop: "2rem",
            marginBottom: "0.5rem",
            fontFamily: "var(--font-display)",
          }}
        >
          Politica de Privacidade
        </h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: "2rem", fontSize: "0.875rem" }}>
          Ultima atualizacao: 20 de maio de 2026
        </p>

        <div className="markdown-body" style={{ lineHeight: 1.8 }}>
          <h2>1. Introducao</h2>
          <p>
            Esta Politica de Privacidade descreve como o Avicena (&quot;nos&quot;, &quot;nosso&quot;) coleta, usa,
            armazena e protege seus dados pessoais, em conformidade com a Lei Geral de Protecao de
            Dados (LGPD — Lei 13.709/2018).
          </p>

          <h2>2. Dados que Coletamos</h2>

          <h3>2.1 Dados de cadastro</h3>
          <ul>
            <li>Nome (fornecido durante onboarding)</li>
            <li>E-mail (via autenticacao Google)</li>
            <li>Curso e periodo de estudo</li>
            <li>Foto de perfil do Google (se disponivel)</li>
          </ul>

          <h3>2.2 Dados de uso</h3>
          <ul>
            <li>Perguntas enviadas ao assistente (anamneses)</li>
            <li>Quantidade de consultas por dia</li>
            <li>Paginas visitadas e tempo de sessao (via PostHog)</li>
          </ul>

          <h3>2.3 Documentos (PDFs)</h3>
          <p>
            Os PDFs enviados sao processados em memoria para gerar respostas e <strong>nao sao
            armazenados permanentemente</strong> em nossos servidores. O conteudo e transmitido de
            forma criptografada (TLS) e descartado apos o processamento da sessao.
          </p>

          <h3>2.4 Dados tecnicos</h3>
          <ul>
            <li>Endereco IP (para seguranca e rate limiting)</li>
            <li>Tipo de navegador e sistema operacional</li>
            <li>Erros e excecoes (via Sentry, anonimizados)</li>
          </ul>

          <h2>3. Base Legal para Tratamento (Art. 7, LGPD)</h2>
          <ul>
            <li>
              <strong>Consentimento (Art. 7, I):</strong> Ao criar sua conta e utilizar a Plataforma,
              voce consente com o tratamento dos dados descritos nesta Politica.
            </li>
            <li>
              <strong>Execucao de contrato (Art. 7, V):</strong> Para fornecer o servico contratado.
            </li>
            <li>
              <strong>Interesse legitimo (Art. 7, IX):</strong> Para melhorar a Plataforma, prevenir
              fraudes e garantir seguranca.
            </li>
          </ul>

          <h2>4. Como Usamos seus Dados</h2>
          <ul>
            <li>Fornecer e personalizar o servico de assistente de estudos;</li>
            <li>Gerenciar sua conta e autenticacao;</li>
            <li>Aplicar limites de uso (rate limiting);</li>
            <li>Monitorar e corrigir erros da Plataforma;</li>
            <li>Analisar padroes de uso para melhorar o produto;</li>
            <li>Comunicar atualizacoes relevantes sobre o servico.</li>
          </ul>

          <h2>5. Compartilhamento de Dados</h2>
          <p>Seus dados podem ser compartilhados com:</p>
          <ul>
            <li>
              <strong>Supabase</strong> (infraestrutura de banco de dados e autenticacao) —
              servidores nos EUA, em conformidade com clausulas contratuais padrao.
            </li>
            <li>
              <strong>Anthropic</strong> (processamento de IA) — o conteudo das perguntas e PDFs e
              enviado para gerar respostas. Anthropic nao retém dados para treinamento conforme
              seus termos de API comercial.
            </li>
            <li>
              <strong>Sentry</strong> (monitoramento de erros) — dados tecnicos anonimizados.
            </li>
            <li>
              <strong>PostHog</strong> (analytics) — dados de uso anonimizados.
            </li>
            <li>
              <strong>Vercel</strong> (hospedagem) — logs de acesso padrao.
            </li>
          </ul>
          <p>
            <strong>Nao vendemos, alugamos ou compartilhamos seus dados com terceiros para fins de
            marketing.</strong>
          </p>

          <h2>6. Armazenamento e Seguranca</h2>
          <p>
            Seus dados sao armazenados em servidores seguros com criptografia em transito (TLS) e
            em repouso. Utilizamos autenticacao OAuth 2.0, tokens seguros e controle de acesso
            baseado em funcoes (RLS) no banco de dados.
          </p>

          <h2>7. Seus Direitos (Art. 18, LGPD)</h2>
          <p>Voce tem direito a:</p>
          <ul>
            <li>Confirmar a existencia de tratamento de dados;</li>
            <li>Acessar seus dados pessoais;</li>
            <li>Corrigir dados incompletos, inexatos ou desatualizados;</li>
            <li>Solicitar anonimizacao, bloqueio ou eliminacao de dados desnecessarios;</li>
            <li>Solicitar a portabilidade dos dados;</li>
            <li>Revogar o consentimento a qualquer momento;</li>
            <li>Solicitar a eliminacao dos dados pessoais tratados com consentimento.</li>
          </ul>
          <p>
            Para exercer qualquer desses direitos, entre em contato pelo e-mail:{" "}
            <strong>privacidade@avicena.app</strong>
          </p>

          <h2>8. Retencao de Dados</h2>
          <ul>
            <li>
              <strong>Dados de conta:</strong> Mantidos enquanto sua conta estiver ativa. Apos
              exclusao da conta, seus dados serao eliminados em ate 30 dias.
            </li>
            <li>
              <strong>PDFs:</strong> Nao sao armazenados apos o processamento da sessao.
            </li>
            <li>
              <strong>Logs de erro:</strong> Retidos por ate 90 dias.
            </li>
            <li>
              <strong>Analytics:</strong> Dados agregados e anonimizados podem ser retidos
              indefinidamente.
            </li>
          </ul>

          <h2>9. Cookies e Tecnologias Similares</h2>
          <p>
            Utilizamos cookies essenciais para autenticacao e gerenciamento de sessao. Cookies
            analiticos (PostHog) sao utilizados para entender padroes de uso. Voce pode desabilitar
            cookies analiticos nas configuracoes do navegador.
          </p>

          <h2>10. Menores de Idade</h2>
          <p>
            A Plataforma e destinada a estudantes universitarios. Nao coletamos intencionalmente
            dados de menores de 18 anos. Se tomarmos conhecimento de que coletamos dados de um
            menor, tomaremos medidas para elimina-los.
          </p>

          <h2>11. Transferencia Internacional de Dados</h2>
          <p>
            Alguns de nossos prestadores de servico estao localizados fora do Brasil (EUA).
            Garantimos que essas transferencias sao realizadas com base em clausulas contratuais
            padrao ou outros mecanismos previstos na LGPD (Art. 33).
          </p>

          <h2>12. Alteracoes nesta Politica</h2>
          <p>
            Podemos atualizar esta Politica periodicamente. Alteracoes substanciais serao
            comunicadas por meio da Plataforma. A data de ultima atualizacao sera sempre indicada
            no topo deste documento.
          </p>

          <h2>13. Contato e Encarregado (DPO)</h2>
          <p>
            Para questoes relacionadas a privacidade e protecao de dados:<br />
            E-mail: <strong>privacidade@avicena.app</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
