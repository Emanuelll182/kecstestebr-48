import React from 'react';

const TermoDeGarantia = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-700 via-purple-800 to-purple-900 text-white py-12">
      <div className="container mx-auto px-4 md:px-8">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 drop-shadow-lg">
          Termo de Garantia
        </h1>
        <p className="text-lg md:text-xl text-center mb-12 opacity-90">
          Garantia contra defeitos de fabricação. Consulte os detalhes abaixo.
        </p>

        <div className="space-y-8 bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-lg">
          <section>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">1. Prazo de Garantia</h2>
            <p className="text-base md:text-lg">
              Todos os produtos possuem <strong> GARANTIA </strong> a partir da data da compra, válida para defeitos de fabricação.
            </p>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">2. O que está coberto</h2>
            <ul className="list-disc list-inside text-base md:text-lg space-y-2">
              <li>Defeitos de fabricação do produto;</li>
              <li>Falhas de funcionamento dentro do uso correto;</li>
              <li>Substituição de peças com defeito, caso necessário.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">3. O que não está coberto</h2>
            <ul className="list-disc list-inside text-base md:text-lg space-y-2">
              <li>Danos causados por mau uso, acidentes ou negligência;</li>
              <li>Produtos danificados por instalação incorreta;</li>
              <li>Desgaste natural de componentes ou acessórios;</li>
              <li>Modificações ou reparos feitos por terceiros sem autorização.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">4. Como acionar a garantia</h2>
            <p className="text-base md:text-lg">
              Para solicitar atendimento de garantia, envie o produto acompanhado da nota fiscal para nossa assistência técnica ou entre em contato pelo nosso suporte. É necessário informar o defeito observado para agilizar a análise.
            </p>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">5. Condições Gerais</h2>
            <p className="text-base md:text-lg">
              A Kecinforstore reserva-se ao direito de avaliar cada solicitação de garantia individualmente. Produtos sem nota fiscal ou fora do prazo estabelecido não terão cobertura. Esta garantia é complementar aos direitos legais do consumidor previstos no Código de Defesa do Consumidor.
            </p>
          </section>
        </div>

        <p className="text-center text-base md:text-lg mt-12 opacity-90">
          Agradecemos por confiar na Kecinforstore. Nosso compromisso é oferecer produtos de qualidade e um atendimento transparente para garantir a sua satisfação.
        </p>
      </div>
    </div>
  );
};

export default TermoDeGarantia;
