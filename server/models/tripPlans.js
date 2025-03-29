import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2"
import status from "../enums/status";
const options = {
    timestamps: true,
    collection: 'tripPlan'
}
const tripPlanSchema = new mongoose.Schema({
    slug: { type: String, required: true },
    name: { type: String, required: true },
    title: { type: String },
    route: { type: String },
    duration: { type: String },
    category: { type: Array },
    ageGroup: { type: String },
    minPrice: { type: String },
    batch: [
        {
            date: { type: String },
            transports: [
                {
                    type: { type: String },
                    costTripleSharing: { type: String },
                    costDoubleSharing: { type: String },
                },
            ],
        },
    ],
    banners: {
        phone: { type: String },
        web: { type: String },
    },
    images: [String],
    metaTitle: { type: String },
    metaDescription: { type: String },
    headline: { type: String },
    description: { type: String },
    shortItinerary: [
        {
            day: { type: String },
            description: { type: String },
        },
    ],
    fullItinerary: [
        {
            day: { type: String },
            title: { type: String },
            description: { type: String },
        },
    ],
    inclusions: [
        {
            title: { type: String },
            description: { type: String },
        },
    ],
    exclusions: [
        {
            title: { type: String },
            description: { type: String },
        },
    ],
    importantPoints: [
        {
            title: { type: String },
            description: { type: String },
        },
    ],
    status: {
        type: String, default: status.active, enums: [status.active, status.delete]
    }
}, options);
tripPlanSchema.plugin(paginate);
const Planner = mongoose.model('tripPlan', tripPlanSchema);



const tripPlanData = {
    slug:'chopta-tungnath',
    name: 'Chopta',
    title: 'Chopta Tungnath Trek',
    route: 'Delhi To Delhi',
    duration: '3D & 2N',
    category: ['Weekend Gateway','New Listing'],
    ageGroup: '18-35',
    minPrice: '8000/-',
    batch: [
        {
            date: '20 Dec - 24 Dec',
            transports: [
                {
                    type: 'Volvo Bus/Tempo Traveller',
                    costTripleSharing: '8000/-',
                    costDoubleSharing: '8500/-',
                },
            ],
        },
        {
            date: '24 Dec - 28 Dec',
            transports: [
                {
                    type: 'Volvo Bus/Tempo Traveller',
                    costTripleSharing: '8000/-',
                    costDoubleSharing: '8500/-',
                },
            ],
        },
        {
            date: '29 Dec - 2 Jan',
            transports: [
                {
                    type: 'Volvo Bus/Tempo Traveller',
                    costTripleSharing: '8000/-',
                    costDoubleSharing: '8500/-',
                },
            ],
        },
    ],
    banners: {
        phone: '/images/chopta/chopta_banner_phone.webp',
        web: '/images/chopta/chopta_banner_web.webp',
    },
    images: [
        'https://travelchapes.s3.eu-north-1.amazonaws.com/images/CHOPTA_TUNGNATH/chopta_new1.webp',
        'https://travelchapes.s3.eu-north-1.amazonaws.com/images/CHOPTA_TUNGNATH/ct7.jpg',
        'https://travelchapes.s3.eu-north-1.amazonaws.com/images/jibhitirthan/jt7.webp',
        'https://travelchapes.s3.eu-north-1.amazonaws.com/images/jibhitirthan/jt8.webp',
        'https://travelchapes.s3.eu-north-1.amazonaws.com/images/kasol_rudrarg/kasol5.webp',
        'https://travelchapes.s3.eu-north-1.amazonaws.com/images/Spiti/spiti4.webp',
        'https://travelchapes.s3.eu-north-1.amazonaws.com/images/CHOPTA_TUNGNATH/ct8.jpg',
        'https://travelchapes.s3.eu-north-1.amazonaws.com/images/CHOPTA_TUNGNATH/ct9.jpg',
        'https://travelchapes.s3.eu-north-1.amazonaws.com/images/CHOPTA_TUNGNATH/ct10.jpg',
        'https://travelchapes.s3.eu-north-1.amazonaws.com/images/CHOPTA_TUNGNATH/ct4.mp4',
    ],
    metaTitle:
        'Chopta Tungnath: Ultimate Weekend Getaway & Trekking Adventure in Uttarakhand',
    metaDescription:
        'Explore Chopta Tungnath, a serene weekend destination in Uttarakhand. Discover the Tungnath Temple trek, scenic landscapes, and adventure activities for an unforgettable experience.',
    headline: 'Chopta Tungnath: Your Perfect Weekend Stopovers',
    description:
        'Commence on a breathtaking journey through the Garhwal Himalayas with a hypnotic view of Deoria tal on Chopta Tungnath Chandrashila Trek, a journey beyond imagination with an itinerary perfectly curated by us. ...',
    shortItinerary: [
        { day: 'Day 0', description: 'Depart from Delhi to Chopta via Rishikesh by 9 PM.' },
        { day: 'Day 1', description: 'Arrive in Chopta for acclimatization and rest.' },
        { day: 'Day 2', description: 'Trek to Tungnath Temple and Chandrashila Peak, and enjoy panoramic views of the Himalayas.' },
        { day: 'Day 3', description: 'Visit Deoria Tal, a picturesque lake with Himalayan reflections.' },
        { day: 'Day 4', description: 'Return to Delhi, and conclude your Chopta adventure by morning.' },
    ],
    fullItinerary: [
        {
            day: 'Day 0',
            title: 'Delhi to Chopta via Rishikesh: (427 km, 10 hrs)',
            description: `- Reach and report at the pickup point, Akshardham Metro Station, by 9 PM.
        - Meet your trip captains for a detailed briefing session.
        - Start your road tour to Chopta, traveling through scenic places like Devprayag and Rudraprayag.
        - Catch a glimpse of the mystique of the Himalayas as you progress on your journey.
        `,
        },
        {
            day: 'Day 1',
            title: 'Arrival in Chopta – Day of Relaxation in Nature',
            description: `- Welcome to Chopta! Upon arrival, relax in your snug camps amidst nature.
      - Leisure Day: Engage in fun group activities, explore landscapes, or bond with fellow trekkers.
      - Evening Views: Enjoy a magnificent view of the snow-capped Himalayan peaks at sunset.
      - Dinner under starlight, then spend a cozy evening in the camps.
    `,
        },
        {
            day: 'Day 2',
            title:'Trek From Chopta to Tungnath Temple and Chandrashila (4 km; 4 hrs)',
            description: `- Early Morning Start: Begin your walk from Chopta to Chandrashila Hill.
      - Visit Tungnath Temple: Pass by the world's highest Shiva temple at 12,106 ft.
      - Scenic Mountain Tops: Climb to Chandrashila and witness panoramic views of peaks like Nanda Devi, Trisul, Kedar Peak, Bandarpunch, and Chaukhamba.
      - Return to Chopta: After enjoying the beauty of the Himalayas, return for a warm dinner and restful night.
    `,
        },
        {
            day: 'Day 3',
            title:'Deoria Tal and Departure Day: A Glimpse of What Makes Your Journey Special',
            description: ` - Morning at Chopta: Start your day with a hearty breakfast.
      - Travel to Sari Village: Begin your trek from Sari to Deoria Tal.
      - Trek to Deoria Tal: A scenic hike to the lake, known for its reflections of the Chaukhamba peaks. Perfect spot for photos and rest.
      - Departure to Delhi: Board the vehicle for your overnight journey back to Delhi, reflecting on the memories made.
    `,
        },
        {
            day: 'Day 4',
            title:'Delhi Arrival: End of the Trip – Farewell to an Unforgettable Adventure',
            description: `- Early Morning Arrival in Delhi, marking the end of your fantastic journey.
    - Say farewell to fellow trekkers and cherish the unforgettable experiences.
  `,
        },


    ],
    inclusions: [
        {
            title: 'Transportation',
            description: 'This is a comprehensive Delhi-to-Delhi trip done in an expansive Tempo Traveler or SUV, ensuring a smooth journey throughout the entire adventure.',
        },
        {
            title: 'Sightseeing',
            description:'All-inclusive sightseeing in the area with your assigned Tempo Traveler. Relax and enjoy the picturesque landscapes and scenic attractions at your convenience.',
        },
        {
            title: 'Accommodation',
            description:'Enjoy a 2-night cozy stay in Swiss Camps nestled in Chopta, offering a perfect blend of comfort and nature.',
        },
        {
            title: 'Guidance',
            description:'Your Trip Captain and local guide will accompany you throughout the journey, ensuring a safe and memorable experience.',
        },
        {
            title: 'Meals Included',
            description:'Four meals are included: dinner on Day 1 and Day 2, and breakfast on Day 2 and Day 3.',
        },
        {
            title: 'Safety First',
            description:'All permit arrangements and a first aid kit are provided to ensure a safe and hassle-free tour.',
        },
        {
            title: 'Driver Expense',
            description:"Driver's allowance, toll taxes, and state taxes are covered, allowing you to travel worry-free.",
        },
        {
            title: 'Free Parking',
            description:'All parking and other charges are included, so you can focus solely on your adventure during the trip.',
        },

    ],
    exclusions: [
        {
            title: 'Tour GST Charges',
            description:'A 5% GST amount is collected on all incidentals throughout the entire trip.',
        },
        {
            title: 'Early Check-Ins',
            description:'Any early hotel check-ins before the standard time are not included in the package.',
        },
        {
            title: 'Extra Personal Expenses',
            description:'Expenses for personal purchases such as snacks, beverages, or any additional items are excluded.',
        },
        {
            title: 'Delayed Travel Expenses',
            description:'Accommodation and meals in case of any travel delays are not included.',
        },
        {
            title: 'Meals and Expenses',
            description:'Expenses for travel outside the scheduled itinerary, including airfare or rail fare, are not included.',
        },
        {
            title: 'Entry Fees',
            description:'Entry fees for monuments or other sightseeing attractions are not included.',
        },
        {
            title: 'Unforeseen Events',
            description:'Additional charges from unforeseen events like flight cancellations, landslides, or road blockages are not covered.',
        },

    ],
    importantPoints: [
        {
            title: 'Winter Accessibility',
            description: 'Please note that heavy snowfall during winter will restrict access to areas like Atul Tunnel, Sissu, Chalal, Jibhi Waterfall, and Serolsar Lake trek. In such cases, alternative plans will be arranged to ensure an enriching experience.',
        },
        {
            title: 'Travel Arrangements',
            description:
                'Travelers from outside Delhi are advised to book their arrival in Delhi by 3 PM on the trip starting date. For departures, it’s better to book return flights or trains after 1 PM at the trip’s end to allow time for any delays.',
        },
        {
            title: 'Itinerary Changes',
            description:
                'We may adjust the itinerary as needed due to unfavorable weather, inaccessible roads, or participants’ physical limitations. Your safety and comfort will always come first when making such adjustments.',
        },
    ],
};

async function insertTripPlan() {
    try {
        const existingTrip = await Planner.findOne({ name: tripPlanData.name });
        if (existingTrip) {
            console.log("Trip plan already exists:");
        } else {
            const newTrip = await Planner.create(tripPlanData);
            console.log("Trip plan inserted successfully:");
        }
    } catch (error) {
        console.error("Error checking or inserting trip plan:", error);
    }
}
insertTripPlan();
module.exports = Planner;


