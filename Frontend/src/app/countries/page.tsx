'use client';

import * as React from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';

type Country = {
  name: string;
  image: string;
  description: string;
  varieties: string[];
};

const countries: Country[] = [
  {
    name: 'Brazil',
    image: '/types/brazil.png',
    description: `As the reigning emperor of the coffee world, Brazil produces beans on a scale that's both awe-inspiring and versatile. Its sun-soaked plantations yield low-acidity, full-bodied beans with chocolatey warmth, nutty sweetness, and a creamy mouthfeel. Whether in your everyday blend or artisanal espresso, Brazil's smooth, mellow character delivers consistency and comfort in every cup.`,
    varieties: ['Bourbon', 'Typica', 'Catuai'],
  },
  {
    name: 'Vietnam',
    image: '/types/vietnam.png',
    description: `Vietnam pulses with coffee energy — the heartbeat of Robusta. These bold beans are low-acid, high-caffeine, and brimming with earthy depth. Brewed slowly through a phin filter and kissed by condensed milk, Vietnam’s signature “cà phê sữa đá” is not just a drink — it's a ritual, a rhythm, a cultural heartbeat.`,
    varieties: ['Robusta'],
  },
  {
    name: 'Colombia',
    image: '/types/colombia.jpg',
    description: `Colombian coffee is like a symphony — smooth, melodic, and brilliantly balanced. Grown high in the Andes, each bean carries whispers of citrus zest, hints of caramel, and a creamy finish. It's the perfect harmony between brightness and body — a gold standard for specialty lovers and everyday drinkers alike.`,
    varieties: ['Caturra', 'Castillo', 'Colombia'],
  },
  {
    name: 'Ethiopia',
    image: '/types/ethiopia.png',
    description: `Ethiopia is the sacred origin of coffee — a cradle of aromatic wonder. From Yirgacheffe’s jasmine bouquets to Sidamo’s stone fruit and blueberry sparkle, Ethiopian beans dance on the palate with floral complexity, wild acidity, and a finish as lingering as ancient folklore.`,
    varieties: ['Heirloom Varietals', 'Yirgacheffe', 'Sidamo'],
  },
  {
    name: 'Indonesia',
    image: '/types/indonesia.jpg',
    description: `Earthy. Mysterious. Deep. Indonesian coffee is a full-bodied tale woven from volcanic soils and tropical rains. Its unique wet-hulling method reveals rustic charm — tobacco, cocoa, cedar, and warm spice — a bold, brooding cup perfect for those who crave richness and intensity.`,
    varieties: ['Sumatra', 'Java', 'Sulawesi'],
  },
  {
    name: 'Kenya',
    image: '/types/kenya.jpg',
    description: `Kenyan beans are electric. Grown on red volcanic soil and auctioned like fine art, they deliver sharp acidity, jammy sweetness, and juicy fruit layers — blackcurrant, tomato, grapefruit. It's not just coffee — it’s a flavor revelation with every pour-over.`,
    varieties: ['SL28', 'SL34', 'Batian'],
  },
  {
    name: 'Honduras',
    image: '/types/honduras.png',
    description: `Honduras has blossomed into a specialty gem. Its beans are delightfully sweet — think milk chocolate, baked apple, and a touch of almond. From cozy family farms tucked in misty mountains, Honduran coffee offers balance, elegance, and heartwarming character.`,
    varieties: ['Catuai', 'Pacas', 'Lempira'],
  },
  {
    name: 'India',
    image: '/types/india.jpg',
    description: `India’s coffee whispers tales of monsoons and spice. The Monsooned Malabar bean, aged in salty winds, brews a cup that's woody, mellow, and low in acidity. Often found in blends, Indian coffees offer warmth, intrigue, and a distinctly exotic profile — like chai’s earthier cousin.`,
    varieties: ['Kent', 'S795', 'SLN9'],
  },
  {
    name: 'Uganda',
    image: '/types/uganda.png',
    description: `From Mt. Elgon’s fertile slopes to the natural Robusta forests, Uganda is a rising star. Its Arabica is bright and winey, with playful fruit notes, while its wild Robusta brings rich, earthy depth. Uganda’s duality bridges tradition and bold evolution.`,
    varieties: ['Bugisu', 'Nganda'],
  },
  {
    name: 'Mexico',
    image: '/types/mexico.jpeg',
    description: `Mexico offers gentle, soulful coffees. Harvested in Chiapas and Oaxaca, its beans bring nutty sweetness, soft cocoa undertones, and mellow acidity. Often grown under shade and certified organic, Mexican coffee reflects purity, heritage, and quiet grace.`,
    varieties: ['Typica', 'Bourbon', 'Mundo Novo'],
  },
];

const ProducerCountriesPage = () => {
  return (
    <div className="bg-white border-border border-4 flex items-center justify-center w-screen relative">
      <div className="text-start h-full py-24 px-16">
        <h1 className="text-5xl font-extrabold text-center mb-16">🌍 Coffee Producer Countries</h1>

        <div className="space-y-16">
          {countries.map((country) => (
            <Card
              key={country.name}
              className="flex flex-col lg:flex-row items-center gap-8 p-8 shadow-xl border-2 border-border rounded-xl bg-white"
            >
              <Image
                src={country.image}
                alt={country.name}
                width={550}
                height={350}
                className="rounded-lg object-cover w-full lg:w-[500px] h-[300px] transition-all hover:scale-[1.01]"
              />
              <div className="text-left flex-1">
                <h2 className="text-3xl font-bold mb-2">{country.name}</h2>
                <p className="text-base text-muted-foreground mb-4 leading-relaxed">
                  {country.description}
                </p>
                <p className="text-base text-gray-800">
                  <strong>Popular Varieties:</strong>{' '}
                  <span className="text-blue-600">{country.varieties.join(', ')}</span>
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProducerCountriesPage;
