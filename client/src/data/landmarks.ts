export type LandmarkCategory = 'beaches' | 'accommodation' | 'restaurants' | 'markets' | 'transport' | 'activities';

export interface Landmark {
    id: string;
    name: string;
    description: string;
    lat: number;
    lng: number;
    category: LandmarkCategory;
    price?: string;
    rating?: string;
    localTip?: string;
}

export const landmarks: Landmark[] = [
    // ========== BEACHES (15) ==========
    { id: 'bch1', name: 'Baga Beach', category: 'beaches', lat: 15.5552, lng: 73.7519, description: 'Vibrant hub with water sports and shacks.', price: 'Free', rating: '4.2/5', localTip: "Britto's for seafood." },
    { id: 'bch2', name: 'Anjuna Beach', category: 'beaches', lat: 15.5739, lng: 73.7419, description: 'Famous for flea markets and trance vibes.', price: 'Free', rating: '4.0/5', localTip: 'Best at sunset from cliff cafes.' },
    { id: 'bch3', name: 'Arambol Beach', category: 'beaches', lat: 15.6849, lng: 73.7026, description: 'Bohemian paradise with freshwater lake.', price: 'Free', rating: '4.3/5', localTip: 'Drum circle at sunset.' },
    { id: 'bch4', name: 'Calangute Beach', category: 'beaches', lat: 15.5440, lng: 73.7554, description: 'The "Queen of Beaches", very popular.', price: 'Free', rating: '4.1/5', localTip: 'Great for parasailing.' },
    { id: 'bch5', name: 'Palolem Beach', category: 'beaches', lat: 15.0100, lng: 74.0236, description: 'Scenic crescent beach with calm waters.', price: 'Free', rating: '4.5/5', localTip: 'Boat to Butterfly Beach.' },
    { id: 'bch6', name: 'Agonda Beach', category: 'beaches', lat: 15.0445, lng: 73.9888, description: 'Quiet, pristine for relaxation.', price: 'Free', rating: '4.6/5', localTip: 'Spot turtles here.' },
    { id: 'bch7', name: 'Vagator Beach', category: 'beaches', lat: 15.5970, lng: 73.7330, description: 'Rocky cliffs and sunset parties.', price: 'Free', rating: '4.2/5', localTip: 'Ozran for seclusion.' },
    { id: 'bch8', name: 'Candolim Beach', category: 'beaches', lat: 15.5156, lng: 73.7625, description: 'Quieter alternative to Calangute.', price: 'Free', rating: '4.3/5', localTip: 'Aguada Fort nearby.' },
    { id: 'bch9', name: 'Morjim Beach', category: 'beaches', lat: 15.6350, lng: 73.7200, description: 'Olive Ridley turtle nesting site.', price: 'Free', rating: '4.4/5', localTip: 'Russian enclave, unique food.' },
    { id: 'bch10', name: 'Colva Beach', category: 'beaches', lat: 15.2801, lng: 73.9117, description: 'South Goa main beach hub.', price: 'Free', rating: '4.0/5', localTip: 'Good for families.' },
    { id: 'bch11', name: 'Benaulim Beach', category: 'beaches', lat: 15.2620, lng: 73.9300, description: 'Laid-back with local restaurants.', price: 'Free', rating: '4.2/5', localTip: 'Pedros for nightlife.' },
    { id: 'bch12', name: 'Varca Beach', category: 'beaches', lat: 15.2200, lng: 73.9350, description: 'White sand, luxury resorts.', price: 'Free', rating: '4.4/5', localTip: 'Dolphin sighting trips.' },
    { id: 'bch13', name: 'Cavelossim Beach', category: 'beaches', lat: 15.1590, lng: 73.9480, description: 'Exclusive South Goa stretch.', price: 'Free', rating: '4.5/5', localTip: 'Leela Resort area.' },
    { id: 'bch14', name: 'Sinquerim Beach', category: 'beaches', lat: 15.4953, lng: 73.7730, description: 'Fort and Taj complex.', price: 'Free', rating: '4.3/5', localTip: 'Aguada Fort walk.' },
    { id: 'bch15', name: 'Patnem Beach', category: 'beaches', lat: 15.0010, lng: 74.0340, description: 'Quieter than Palolem next door.', price: 'Free', rating: '4.4/5', localTip: 'Yoga retreats popular.' },

    // ========== ACCOMMODATION (12) ==========
    { id: 'acc1', name: 'The Hosteller Goa', category: 'accommodation', lat: 15.5720, lng: 73.7410, description: 'Social hostel in Anjuna.', price: '₹400-₹1,100', rating: '4.2/5', localTip: 'Community dinners.' },
    { id: 'acc2', name: 'Whoopers Hostel', category: 'accommodation', lat: 15.0095, lng: 74.0220, description: 'Backpacker favorite near Palolem.', price: '₹300-₹850', rating: '4.5/5', localTip: 'Rooftop bar events.' },
    { id: 'acc3', name: 'Taj Holiday Village', category: 'accommodation', lat: 15.4983, lng: 73.7693, description: 'Luxury heritage resort.', price: '₹8,000-₹15,000', rating: '4.7/5', localTip: 'Best Thai in Goa.' },
    { id: 'acc4', name: 'Siolim House', category: 'accommodation', lat: 15.6244, lng: 73.7692, description: '247-year heritage manor.', price: '₹2,500-₹4,000', rating: '4.8/5', localTip: 'Book the Blue Room.' },
    { id: 'acc5', name: 'Zappia Cove Eco Resort', category: 'accommodation', lat: 15.0430, lng: 73.9900, description: 'Sustainable eco-cottages.', price: '₹2,800-₹4,200', rating: '4.3/5', localTip: 'Digital detox.' },
    { id: 'acc6', name: 'The St. Regis Goa', category: 'accommodation', lat: 15.5130, lng: 73.7770, description: 'Ultra-luxury beachfront.', price: '₹30,000+', rating: '4.9/5', localTip: 'Butler service included.' },
    { id: 'acc7', name: 'Taj Exotica', category: 'accommodation', lat: 15.2500, lng: 73.9400, description: '56-acre luxury resort.', price: '₹20,000+', rating: '4.8/5', localTip: 'Private beach access.' },
    { id: 'acc8', name: 'Panjim Inn', category: 'accommodation', lat: 15.4970, lng: 73.8260, description: 'Heritage hotel in Fontainhas.', price: '₹6,500-₹10,000', rating: '4.8/5', localTip: 'Walking tours included.' },
    { id: 'acc9', name: 'Funky Monkey Hostel', category: 'accommodation', lat: 15.5740, lng: 73.7415, description: 'Budget party hostel.', price: '₹350-₹900', rating: '4.0/5', localTip: 'Rooftop bar.' },
    { id: 'acc10', name: 'Hyatt Place Candolim', category: 'accommodation', lat: 15.5150, lng: 73.7620, description: 'Modern 4-star hotel.', price: '₹5,000-₹8,000', rating: '4.4/5', localTip: 'Easy beach access.' },
    { id: 'acc11', name: 'Club Mahindra Varca', category: 'accommodation', lat: 15.2180, lng: 73.9400, description: 'Family resort.', price: '₹4,000-₹6,500', rating: '4.5/5', localTip: 'Kids activities.' },
    { id: 'acc12', name: 'Leela Goa', category: 'accommodation', lat: 15.1600, lng: 73.9500, description: 'Iconic 5-star on private beach.', price: '₹25,000+', rating: '4.7/5', localTip: 'Lagoon pools.' },

    // ========== RESTAURANTS (12) ==========
    { id: 'rst1', name: 'Gunpowder', category: 'restaurants', lat: 15.5921, lng: 73.7649, description: 'Fusion South Indian in restored villa.', price: '₹800-₹1,200', rating: '4.5/5', localTip: 'Kerala Mutton Curry with Appam.' },
    { id: 'rst2', name: 'Black Sheep Bistro', category: 'restaurants', lat: 15.4972, lng: 73.8268, description: 'Modern Goan fusion.', price: '₹2,000-₹3,000', rating: '4.6/5', localTip: 'Chorizo Poutine.' },
    { id: 'rst3', name: 'Viva Panjim', category: 'restaurants', lat: 15.4976, lng: 73.8265, description: 'Authentic Goan in Fontainhas.', price: '₹600-₹800', rating: '4.1/5', localTip: 'Family recipe Sorpotel.' },
    { id: 'rst4', name: 'Ritz Classic', category: 'restaurants', lat: 15.4950, lng: 73.8290, description: 'Legendary Goan Fish Thali.', price: '₹700-₹1,000', rating: '4.3/5', localTip: 'Go early, sells out.' },
    { id: 'rst5', name: "Mum's Kitchen", category: 'restaurants', lat: 15.4980, lng: 73.8255, description: 'Traditional Goan heritage.', price: '₹700-₹1,000', rating: '4.4/5', localTip: 'Chicken Cafreal.' },
    { id: 'rst6', name: 'Bhatti Village', category: 'restaurants', lat: 15.5047, lng: 73.7948, description: 'Homely family restaurant.', price: '₹600-₹900', rating: '4.4/5', localTip: 'Owner suggests catch of the day.' },
    { id: 'rst7', name: "Britto's", category: 'restaurants', lat: 15.5550, lng: 73.7515, description: 'Iconic Baga beach shack.', price: '₹800-₹1,500', rating: '4.2/5', localTip: 'Prawn curry rice.' },
    { id: 'rst8', name: 'Curlies', category: 'restaurants', lat: 15.5730, lng: 73.7400, description: 'Anjuna sunset spot.', price: '₹500-₹1,000', rating: '4.0/5', localTip: 'Trance parties at night.' },
    { id: 'rst9', name: 'Infantaria', category: 'restaurants', lat: 15.5440, lng: 73.7550, description: 'Legendary breakfast cafe.', price: '₹300-₹600', rating: '4.3/5', localTip: 'Croissants and coffee.' },
    { id: 'rst10', name: 'Fisherman Wharf', category: 'restaurants', lat: 15.4500, lng: 73.8000, description: 'Riverside seafood.', price: '₹1,200-₹2,000', rating: '4.4/5', localTip: 'Sunset views.' },
    { id: 'rst11', name: 'Martin Corner', category: 'restaurants', lat: 15.2620, lng: 73.9280, description: 'South Goa institution.', price: '₹700-₹1,200', rating: '4.5/5', localTip: 'Butter garlic crab.' },
    { id: 'rst12', name: 'Dropadi', category: 'restaurants', lat: 15.0100, lng: 74.0230, description: 'Palolem beachfront.', price: '₹400-₹800', rating: '4.2/5', localTip: 'Fresh catch daily.' },

    // ========== MARKETS (8) ==========
    { id: 'mkt1', name: 'Anjuna Flea Market', category: 'markets', lat: 15.5740, lng: 73.7400, description: 'Iconic Wednesday market.', price: 'Free entry', rating: '4.4/5', localTip: 'Bargain at 40% of asking.' },
    { id: 'mkt2', name: 'Saturday Night Market', category: 'markets', lat: 15.6050, lng: 73.7550, description: 'Arpora bazaar with live music.', price: 'Free entry', rating: '4.5/5', localTip: 'Best after 8 PM.' },
    { id: 'mkt3', name: 'Mapusa Friday Market', category: 'markets', lat: 15.5920, lng: 73.8120, description: 'Local produce and spices.', price: 'Free entry', rating: '4.2/5', localTip: 'Friday mornings are best.' },
    { id: 'mkt4', name: 'Panaji Municipal Market', category: 'markets', lat: 15.4990, lng: 73.8280, description: 'Daily vegetables and sweets.', price: 'Free entry', rating: '4.0/5', localTip: 'Early morning best.' },
    { id: 'mkt5', name: 'Ingo Market', category: 'markets', lat: 15.5100, lng: 73.8400, description: 'International quirky finds.', price: 'Free entry', rating: '3.8/5', localTip: 'Sat-Sun only.' },
    { id: 'mkt6', name: 'Margao Market', category: 'markets', lat: 15.2850, lng: 73.9500, description: 'South Goa main market.', price: 'Free entry', rating: '4.1/5', localTip: 'Fresh fish.' },
    { id: 'mkt7', name: 'Calangute Market Square', category: 'markets', lat: 15.5450, lng: 73.7550, description: 'Tourist souvenirs.', price: 'Free entry', rating: '3.7/5', localTip: 'Bargain heavily.' },
    { id: 'mkt8', name: 'Palolem Beach Market', category: 'markets', lat: 15.0110, lng: 74.0240, description: 'Beachwear and trinkets.', price: 'Free entry', rating: '4.0/5', localTip: 'Evening browsing.' },

    // ========== TRANSPORT (10) ==========
    { id: 'trn1', name: 'Dabolim Airport (GOI)', category: 'transport', lat: 15.3809, lng: 73.8314, description: 'Main international airport.', price: 'Taxi ₹800-₹2,500', rating: '3.8/5', localTip: 'Pre-book GoaMiles.' },
    { id: 'trn2', name: 'Mopa Airport (GOX)', category: 'transport', lat: 15.7300, lng: 73.8670, description: 'New North Goa airport.', price: 'Taxi ₹500-₹1,500', rating: '4.5/5', localTip: 'Closer to beaches.' },
    { id: 'trn3', name: 'Thivim Railway Station', category: 'transport', lat: 15.6011, lng: 73.7997, description: 'North Goa railhead.', price: 'Train ₹200-₹800', rating: '4.0/5', localTip: 'Closest to Anjuna/Baga.' },
    { id: 'trn4', name: 'Margao Railway Station', category: 'transport', lat: 15.2770, lng: 73.9600, description: 'South Goa main station.', price: 'Train ₹200-₹800', rating: '4.1/5', localTip: 'Konkan Railway hub.' },
    { id: 'trn5', name: 'Kadamba Bus Stand Panaji', category: 'transport', lat: 15.4989, lng: 73.8273, description: 'Main bus terminal.', price: 'Bus ₹10-₹400', rating: '3.5/5', localTip: 'Cheapest intercity.' },
    { id: 'trn6', name: 'Kadamba Bus Stand Margao', category: 'transport', lat: 15.2850, lng: 73.9580, description: 'South Goa bus hub.', price: 'Bus ₹10-₹400', rating: '3.6/5', localTip: 'To Palolem buses.' },
    { id: 'trn7', name: 'Panaji-Betim Ferry', category: 'transport', lat: 15.5030, lng: 73.8200, description: 'Free passenger ferry.', price: 'Free (bikes ₹20)', rating: '4.2/5', localTip: 'Quick Old Goa access.' },
    { id: 'trn8', name: 'Ribandar-Chorao Ferry', category: 'transport', lat: 15.5100, lng: 73.8600, description: 'Access to bird sanctuary.', price: 'Free (bikes ₹20)', rating: '4.0/5', localTip: 'Salim Ali Sanctuary.' },
    { id: 'trn9', name: 'Querim-Tiracol Ferry', category: 'transport', lat: 15.7250, lng: 73.7180, description: 'Northernmost ferry.', price: 'Free (bikes ₹15)', rating: '4.3/5', localTip: 'To Tiracol Fort.' },
    { id: 'trn10', name: 'Vasco Railway Station', category: 'transport', lat: 15.3970, lng: 73.8130, description: 'Port city station.', price: 'Train ₹200-₹800', rating: '3.7/5', localTip: 'Near Dabolim airport.' },

    // ========== ACTIVITIES (15) ==========
    { id: 'act1', name: 'Dudhsagar Falls', category: 'activities', lat: 15.3144, lng: 74.3143, description: 'Iconic 310m four-tier waterfall.', price: '₹660-₹900 jeep', rating: '4.7/5', localTip: 'Go at 6 AM to avoid crowds.' },
    { id: 'act2', name: 'Basilica of Bom Jesus', category: 'activities', lat: 15.5008, lng: 73.9116, description: 'UNESCO World Heritage church.', price: 'Free', rating: '4.6/5', localTip: 'Morning for quiet.' },
    { id: 'act3', name: "Tito's Nightclub", category: 'activities', lat: 15.5535, lng: 73.7530, description: 'Most famous nightclub in Asia.', price: '₹1,500-₹3,000', rating: '4.0/5', localTip: 'Couples: ₹1,500. Stags: ₹2,500+' },
    { id: 'act4', name: 'Club Cubana', category: 'activities', lat: 15.5700, lng: 73.7420, description: 'Hilltop club with infinity pool.', price: '₹1,500-₹2,500', rating: '4.3/5', localTip: 'Ladies free on Wednesdays.' },
    { id: 'act5', name: 'Fort Aguada', category: 'activities', lat: 15.4935, lng: 73.7732, description: '17th-century Portuguese fort.', price: '₹25', rating: '4.4/5', localTip: 'Sunset views.' },
    { id: 'act6', name: 'Spice Plantation Tour', category: 'activities', lat: 15.4200, lng: 74.0500, description: 'Sahakari/Tropical farms.', price: '₹400-₹600', rating: '4.4/5', localTip: 'Includes lunch.' },
    { id: 'act7', name: 'Salim Ali Bird Sanctuary', category: 'activities', lat: 15.5150, lng: 73.8700, description: 'Mangrove birdwatching.', price: '₹20', rating: '4.2/5', localTip: 'Boat ride extra.' },
    { id: 'act8', name: 'Chorla Ghats Waterfall', category: 'activities', lat: 15.5800, lng: 74.1200, description: 'Hidden gem, less crowded.', price: '₹50-₹100', rating: '3.5/5', localTip: '20% of Dudhsagar crowds.' },
    { id: 'act9', name: 'Casino Pride', category: 'activities', lat: 15.4920, lng: 73.8250, description: 'Offshore casino on Mandovi.', price: '₹2,000-₹5,000', rating: '4.1/5', localTip: 'Unlimited food/drinks included.' },
    { id: 'act10', name: 'Divar Island', category: 'activities', lat: 15.5200, lng: 73.8800, description: 'Peaceful village by ferry.', price: 'Free', rating: '4.3/5', localTip: 'Old Churches.' },
    { id: 'act11', name: 'Se Cathedral', category: 'activities', lat: 15.5020, lng: 73.9110, description: 'One of Asia largest churches.', price: 'Free', rating: '4.5/5', localTip: 'Golden Bell.' },
    { id: 'act12', name: 'Fontainhas Latin Quarter', category: 'activities', lat: 15.4975, lng: 73.8255, description: 'Colorful Portuguese heritage area.', price: 'Free', rating: '4.6/5', localTip: 'Photo walks.' },
    { id: 'act13', name: 'Tiracol Fort', category: 'activities', lat: 15.7330, lng: 73.7200, description: 'Northernmost heritage fort.', price: 'Free', rating: '4.2/5', localTip: 'Now a heritage hotel.' },
    { id: 'act14', name: 'Arvalem Caves', category: 'activities', lat: 15.5700, lng: 73.9000, description: '5th-century rock-cut caves.', price: '₹25', rating: '3.8/5', localTip: 'Waterfall nearby.' },
    { id: 'act15', name: 'Butterfly Beach', category: 'activities', lat: 14.9930, lng: 74.0350, description: 'Secluded south beach by boat.', price: '₹200-₹300 boat', rating: '4.5/5', localTip: 'Dolphins on the way.' },
];

export const categoryLabels: Record<LandmarkCategory, string> = {
    beaches: '🏖️ Beaches',
    accommodation: '🏠 Stays',
    restaurants: '🍽️ Food',
    markets: '🛍️ Markets',
    transport: '🚌 Transport',
    activities: '🎯 Activities',
};
