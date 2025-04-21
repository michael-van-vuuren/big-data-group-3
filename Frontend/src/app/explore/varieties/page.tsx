import Image from 'next/image';
import { Card } from '@/components/card';

type Subcategory = {
  name: string;
  image: string;
  examples: string[];
  description: string;
};

type Category = {
  title: string;
  description: string;
  subcategories: Subcategory[];
};

const categories: Category[] = [
  {
    title: 'Fruity',
    description:
      'Fruity notes brighten your cup with vibrant, juicy flavors that resemble fresh, ripe fruits. They often indicate lighter roasts and highlight acidity, offering a dynamic, refreshing profile.',
    subcategories: [
      {
        name: 'Citrus',
        image: '/types/citrus.jpg',
        examples: ['Lemon', 'Lime', 'Orange', 'Yuzu', 'Grapefruit'],
        description:
          'Zingy and effervescent, citrus notes sparkle on the palate with tangy acidity, often creating a clean and snappy finish in lighter roasts.'
      },
      {
        name: 'Berry',
        image: '/types/berry.jpg',
        examples: ['Strawberry', 'Raspberry', 'Blueberry', 'Blackberry'],
        description:
          'Berry notes offer a luscious, sometimes tart sweetness — reminiscent of jam, compote, or ripe orchard harvests, often found in African coffees.'
      },
      {
        name: 'Stone Fruit',
        image: '/types/stone-fruit.jpg',
        examples: ['Peach', 'Plum', 'Cherry', 'Apricot'],
        description:
          'Stone fruits bring velvety sweetness, soft acidity, and floral backnotes. Think summer peaches or cherries blooming into your brew.'
      }
    ]
  },
  {
    title: 'Herbal',
    description:
      'Herbal notes in coffee resemble the scents of a garden — floral, leafy, or earthy. They connect the cup to nature, often grounding or gently perfuming the profile.',
    subcategories: [
      {
        name: 'Floral',
        image: '/types/floral.png',
        examples: ['Jasmine', 'Lavender', 'Rose', 'Hibiscus'],
        description:
          'Floral notes evoke the elegance of perfume and spring blossoms, often floating above the cup in light, airy waves — delicate and dreamy.'
      },
      {
        name: 'Vegetal',
        image: '/types/vegetal.jpg',
        examples: ['Bell Pepper', 'Tomato', 'Rhubarb', 'Spinach'],
        description:
          'Vegetal flavors are fresh and green — from leafy to savory. They bring complexity and terroir, sometimes surprising the drinker in the best way.'
      },
      {
        name: 'Earthy',
        image: '/types/earthy.jpg',
        examples: ['Mushroom', 'Cedar', 'Soil', 'Matcha'],
        description:
          'Earthy notes are grounding and robust, conjuring forest walks, wet soil, and aged wood — common in Indonesian and aged coffees.'
      }
    ]
  },
  {
    title: 'Savory',
    description:
      'Savory notes introduce umami, spice, and toasted richness — perfect for those who love depth and complexity. These flavors are less common but endlessly intriguing.',
    subcategories: [
      {
        name: 'Spice',
        image: '/types/spice.jpg',
        examples: ['Cinnamon', 'Cardamom', 'Black Pepper', 'Clove'],
        description:
          'Spice adds warmth and mystery, like baking spices or masala chai. They often appear in naturally processed beans or darker roasts.'
      },
      {
        name: 'Umami',
        image: '/types/umami.png',
        examples: ['Soy Sauce', 'Miso', 'Fermented', 'Meat'],
        description:
          'Umami is deep, savory, and broth-like — think soy sauce or mushrooms. Rare in coffee, but unforgettable when present.'
      },
      {
        name: 'Roasted',
        image: '/types/roasted.jpg',
        examples: ['Toast', 'Smoky', 'Charred Wood'],
        description:
          'These bold, fire-kissed notes reflect higher roasting temperatures — dark, smoky, sometimes even campfire-like.'
      }
    ]
  },
  {
    title: 'Warm',
    description:
      'Warm notes evoke comfort — grainy, nutty, and cozy. They are the backbone of many medium to dark roast profiles and are loved for their approachability.',
    subcategories: [
      {
        name: 'Grain',
        image: '/types/grain.jpg',
        examples: ['Oat', 'Toast', 'Rye', 'Bran'],
        description:
          'Grain notes bring cereal-like depth — like granola, toasted bread, or warm bran muffins. Perfect for morning cups.'
      },
      {
        name: 'Nut',
        image: '/types/nut.png',
        examples: ['Almond', 'Hazelnut', 'Walnut', 'Pistachio'],
        description:
          'Nutty tones add richness and smooth mouthfeel. A familiar flavor in many approachable blends and classic espressos.'
      }
    ]
  },
  {
    title: 'Sweet',
    description:
      'Sweet flavors range from dessert-like to syrupy — rounding out acidity and bringing delightful indulgence to every sip.',
    subcategories: [
      {
        name: 'Sugary',
        image: '/types/sugary.jpg',
        examples: ['Caramel', 'Honey', 'Brown Sugar', 'Maple'],
        description:
          'Sugary notes are rich and coating — like melted caramel, golden syrup, or honey drizzled over toast.'
      },
      {
        name: 'Chocolate',
        image: '/types/chocolate.jpg',
        examples: ['Cocoa', 'Dark Chocolate', 'Fudge', 'Mocha'],
        description:
          'Chocolate is a crowd-pleaser. It ranges from sweet milk chocolate to bitter cocoa — creamy, luxurious, and comforting.'
      },
      {
        name: 'Confectionary',
        image: '/types/confectionary.jpg',
        examples: ['Donut', 'Pie', 'Ice Cream', 'Custard'],
        description:
          'This group captures dessert decadence — creamy, flaky, and nostalgic. Like walking past a pastry shop in full bloom.'
      }
    ]
  }
];

const TypesOfCoffeePage = () => {
  return (
    <div className="bg-blue-900 border-border border-4 flex items-center justify-center w-screen relative grid-bg-dot">
      <div className=" bg-white border-0 lg:border-2 border-black text-start h-full py-24 px-8 max-w-5xl shadow-light my-0 lg:my-24">
        <h2 className="text-center text-4xl sm:text-4xl md:text-5xl font-extrabold text-foreground cosmic-bg bg-clip-text text-transparent mb-16">Coffee Flavor Notes</h2>

        {categories.map((category) => (
          <section key={category.title} className="mb-16">
            <h2 className="text-3xl font-bold mb-4">{category.title}</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-3xl">{category.description}</p>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {category.subcategories.map((sub) => (
                <Card key={sub.name} className="p-4">
                  <Image
                    src={sub.image}
                    alt={sub.name}
                    width={500}
                    height={300}
                    className="mb-4 border-2 border-black w-full h-[200px] object-cover"
                  />
                  <h3 className="text-xl font-semibold">{sub.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{sub.description}</p>
                  <p className="text-sm text-muted-foreground">
                    Examples: {sub.examples.join(', ')}
                  </p>
                </Card>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default TypesOfCoffeePage;
