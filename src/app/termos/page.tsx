import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de Uso — Avicena",
  description: "Termos de uso da plataforma Avicena.",
};

export default function TermosPage() {
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
          Termos de Uso
        </h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: "2rem", fontSize: "0.875rem" }}>
          Ultima atualizacao: 20 de maio de 2026
        </p>

        <div className="markdown-body" style={{ lineHeight: 1.8 }}>
          <h2>1. Aceitacao dos Termos</h2>
          <p>
            Ao acessar ou utilizar a plataforma Avicena (&quot;Plataforma&quot;), voce concorda com estes
            Termos de Uso. Se nao concordar, nao utilize a Plataforma.
          </p>

          <h2>2. Descricao do Servico</h2>
          <p>
            O Avicena e uma ferramenta de apoio ao estudo para estudantes de cursos da area da saude.
            A Plataforma permite o upload de documentos em PDF e a interacao com um assistente de
            inteligencia artificial (&quot;Hipocrates&quot;) que responde perguntas com base no conteudo
            fornecido.
          </p>

          <h2>3. Natureza Educacional — Nao Substitui Orientacao Clinica</h2>
          <p>
            <strong>
              O Avicena e exclusivamente uma ferramenta de estudo. As respostas geradas pela
              inteligencia artificial NAO constituem diagnostico, prescricao, orientacao clinica ou
              aconselhamento medico.
            </strong>{" "}
            Nenhuma informacao fornecida pela Plataforma deve ser interpretada como substituta de
            avaliacao, diagnostico ou tratamento por profissional de saude habilitado.
          </p>

          <h2>4. Cadastro e Conta</h2>
          <p>
            Para utilizar a Plataforma, voce deve criar uma conta via autenticacao Google. Voce e
            responsavel por manter a seguranca de sua conta e por todas as atividades realizadas
            por meio dela.
          </p>

          <h2>5. Uso Aceitavel</h2>
          <p>Voce concorda em:</p>
          <ul>
            <li>Utilizar a Plataforma apenas para fins educacionais e de estudo;</li>
            <li>Nao fazer upload de documentos que violem direitos autorais de terceiros;</li>
            <li>Nao utilizar a Plataforma para obter orientacao clinica real;</li>
            <li>Nao tentar contornar os limites de uso estabelecidos;</li>
            <li>Nao realizar engenharia reversa ou tentativas de acesso nao autorizado.</li>
          </ul>

          <h2>6. Documentos Enviados (PDFs)</h2>
          <p>
            Os PDFs que voce envia sao processados exclusivamente para gerar respostas durante sua
            sessao de estudo. Os documentos sao transmitidos de forma criptografada e nao sao
            armazenados permanentemente em nossos servidores apos o processamento da sessao.
          </p>

          <h2>7. Limites de Uso</h2>
          <p>
            O plano gratuito permite ate 50 consultas (anamneses) por dia. Limites adicionais podem
            ser aplicados conforme o plano contratado. Reservamo-nos o direito de ajustar estes
            limites mediante aviso previo.
          </p>

          <h2>8. Propriedade Intelectual</h2>
          <p>
            A Plataforma, incluindo seu codigo, design, marca e conteudo original, e propriedade
            dos desenvolvedores do Avicena. O uso da Plataforma nao concede a voce nenhum direito
            sobre a propriedade intelectual do Avicena.
          </p>

          <h2>9. Isencao de Garantias</h2>
          <p>
            A Plataforma e fornecida &quot;como esta&quot; (as is). Nao garantimos que as respostas geradas
            pela IA sejam precisas, completas ou livres de erros. O uso das informacoes e por sua
            conta e risco.
          </p>

          <h2>10. Limitacao de Responsabilidade</h2>
          <p>
            Em nenhuma hipotese seremos responsaveis por danos diretos, indiretos, incidentais ou
            consequenciais decorrentes do uso ou impossibilidade de uso da Plataforma, incluindo,
            mas nao se limitando a, decisoes clinicas tomadas com base em informacoes da Plataforma.
          </p>

          <h2>11. Modificacoes</h2>
          <p>
            Reservamo-nos o direito de modificar estes Termos a qualquer momento. Alteracoes
            substanciais serao comunicadas por meio da Plataforma. O uso continuado apos as
            modificacoes constitui aceitacao dos novos Termos.
          </p>

          <h2>12. Rescisao</h2>
          <p>
            Podemos suspender ou encerrar seu acesso a qualquer momento, por violacao destes Termos
            ou por qualquer outro motivo justificado, mediante notificacao.
          </p>

          <h2>13. Legislacao Aplicavel</h2>
          <p>
            Estes Termos sao regidos pela legislacao da Republica Federativa do Brasil. Eventuais
            disputas serao submetidas ao foro da comarca de domicilio do usuario.
          </p>

          <h2>14. Contato</h2>
          <p>
            Para duvidas sobre estes Termos, entre em contato pelo e-mail:{" "}
            <strong>contato@avicena.app</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
