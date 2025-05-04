import garlicBread from "../assets/imgCatalog/garlic-bread.jpg";
import bruschetta from "../assets/imgCatalog/bruschetta.jpg";
import margheritaPizza from "../assets/imgCatalog/margherita-pizza.jpg";
import spaghettiCarbonara from "../assets/imgCatalog/spaghetti-carbonara.jpg";
import tiramisu from "../assets/imgCatalog/tiramisu.jpg";
import italianSoda from "../assets/imgCatalog/italian-soda.jpg";

export const mockMenuData = {
  categories: ['Entrantes', 'Principales', 'Postres', 'Bebidas'],
  items: [
    {
      id: 1,
      category: 'Entrantes',
      name: 'Garlic Bread',
      description: 'Toasted ciabatta with herb butter',
      price: 6.99,  
      image: garlicBread,
    },
    {
      id: 2,
      category: 'Entrantes',
      name: 'Bruschetta',
      description: 'Fresh tomatoes, basil, and olive oil on grilled bread',
      price: 8.5,
      image: bruschetta,
    },
    {
      id: 3,
      category: 'Principales',
      name: 'Margherita Pizza',
      description: 'San Marzano tomatoes, fresh mozzarella, basil',
      price: 14.99, 
      image: margheritaPizza,
    },
    {
      id: 4,
      category: 'Principales',
      name: 'Spaghetti Carbonara',
      description: 'Traditional Roman pasta with guanciale and egg',
      price: 16.5,
      image: spaghettiCarbonara,
    },
    {
      id: 5,
      category: 'Postres',
      name: 'Tiramisu',
      description: 'Classic Italian dessert with coffee and mascarpone',
      price: 7.99, 
      image: tiramisu,
    },
    {
      id: 6,
      category: 'Bebidas',
      name: 'Italian Soda',
      description: 'Sparkling water with natural fruit syrup',
      price: 4.5,
      image: italianSoda,
    },
  ],
};