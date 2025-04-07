'use client';

import React from 'react';
import Image from 'next/image';

export default function IntroductionPage() {
  return (
    <div className="bg-white border-border border-4 flex items-center justify-center w-screen relative">
      <div className="text-start h-full py-24 px-16">

        {/* 🌟 Title */}
        <h1 className="text-5xl font-extrabold mb-10">
          Welcome to the World of Coffee <span role="img" aria-label="coffee">☕</span>
        </h1>

        {/* 🍃 Hero Coffee Farm Image */}
        <div className="mb-10">
          <Image
            src="/hero-coffee-farm.png"
            alt="Coffee farm hero"
            width={800}
            height={450}
            className="rounded-xl shadow-lg mx-auto object-cover"
          />
        </div>

        {/* 🪔 Paragraph 1: Origins & Cultural Relevance */}
        <p className="text-lg text-gray-700 mb-10 leading-relaxed max-w-3xl mx-auto">
          Coffee is more than a beverage; it’s an ancient thread interwoven into the cultural fabric of civilizations. Tracing its mystic origins to the Ethiopian highlands, legend speaks of Kaldi — the goat herder who first witnessed coffee’s magic through the jubilant energy of his herd. From sacred Sufi ceremonies in Yemen to bustling Parisian cafés where revolutions were whispered over demitasses, coffee has always been more than just a drink — it’s a symbol of intellect, connection, and rebellion. Throughout time, the humble bean has fueled philosophers, writers, traders, and revolutionaries alike. It has transcended borders to become a ritual of presence, of pause, and of shared humanity.
        </p>

        {/* ☕ Beans Image */}
        <div className="mb-10">
          <Image
            src="/coffee-beans-closeup.jpg"
            alt="Close-up of roasted coffee beans"
            width={700}
            height={400}
            className="rounded-xl shadow-md mx-auto object-cover"
          />
        </div>

        {/* 🍒 Paragraph 2: The Bean’s Journey */}
        <p className="text-lg text-gray-700 mb-10 leading-relaxed max-w-3xl mx-auto">
          The voyage of a coffee bean is one of transformation — a journey from cherry to cup, shaped by sun, soil, and soul. Nestled within a vibrant red fruit lies a green seed, cradled in the hands of farmers across Brazil, Guatemala, and Ethiopia. Harvested with precision and care, the beans are processed using methods that coax out their natural complexity — be it washed, honey, or naturally dried under golden skies. Roasters, like alchemists, apply just the right amount of heat and timing to unlock layers of flavor buried within. The result is a sensory symphony — aromas of toasted hazelnut, notes of plum or bergamot, and textures that dance across the palate like velvet.
        </p>

        {/* 🧠 Paragraph 3: Chemistry & Complexity */}
        <p className="text-lg text-gray-700 mb-10 leading-relaxed max-w-3xl mx-auto">
          At its heart, coffee is both art and chemistry — a scientific marvel hidden in a warm, aromatic cup. Every stage, from grinding to extraction, is a delicate balance of solubles, temperature, time, and texture. Behind each shot of espresso lies a story of water pH, grind calibration, bloom control, and precise pressure. Within its steamy swirl, nearly a thousand chemical compounds awaken your senses — each one delivering its own aroma, flavor, or mouthfeel. It’s a living, breathing creation — never quite the same, and yet always familiar.
        </p>

        {/* 🧑‍🤝‍🧑 People Image */}
        <div className="mb-10">
          <Image
            src="/people-drinking-coffee.jpg"
            alt="People enjoying coffee together"
            width={700}
            height={400}
            className="rounded-xl shadow-md mx-auto object-cover"
          />
        </div>

        {/* 💬 Paragraph 4: Connection & Community */}
        <p className="text-lg text-gray-700 mb-10 leading-relaxed max-w-3xl mx-auto">
          Coffee connects us — not only through caffeine, but through emotion, ritual, and presence. It’s the conversation starter between strangers, the comfort during heartbreak, the celebratory toast on a new beginning. From remote mountain farms to hip city cafés, it brings together hands, hearts, and heritage. The act of brewing — be it a meticulously dialed-in pour-over or a strong decoction from a grandmother’s pot — is an offering of love. Across languages, time zones, and generations, coffee speaks a universal language of warmth and welcome.
        </p>

        {/* 🌍 Paragraph 5: Global Tapestry & Culture */}
        <p className="text-lg text-gray-700 mb-10 leading-relaxed max-w-3xl mx-auto">
          Coffee’s global journey has created a mosaic of customs, flavors, and expressions. In Turkey, it’s brewed thick and rich with fortune-telling sediments. In Japan, it’s an art of patience and presentation. In Sweden, fika is a sacred daily coffee break shared with pastries and conversation. Meanwhile, in bustling cafés of Italy, the barista knows your order by the rhythm of your stride. Coffee adapts to every culture it touches — yet always returns to its essence: a moment carved out of time, a sensory embrace between human and habit.
        </p>

        {/* 🌏 Closing Paragraph: Invitation */}
        <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
          In this space, we invite you to dive deep into the mesmerizing world of coffee — to explore the beans, the brews, the people, and the places that make it magic. Whether you're a curious newcomer or a seasoned aficionado, this journey promises to stir both your senses and your soul. Explore how climate change affects coffee’s future, how baristas compete on global stages, and how a single cup can empower entire communities. Let your love for coffee expand from daily ritual to global story. Because the world in your mug is far more extraordinary than it seems.
        </p>

      </div>
    </div>
  );
}
