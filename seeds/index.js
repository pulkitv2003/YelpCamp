// Purpose: Seed the database with dummy data
if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}
const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
const axios = require('axios');
const dbUrl = process.env.DB_URL;

mongoose.connect(dbUrl);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const fetchRandomImage = async () => {
  try {
    const response = await axios.get('https://api.unsplash.com/photos/random?client_id=5oFPoSzpx3lPugsr1XbSTqbP3BMMgsPEt9d_cPLtIg0&collections=79160812');
    const imageUrl = response.data.urls.regular;
    return imageUrl;
  } catch (error) {
    console.error('Error fetching image:');
    return null;
  }
};
fetchRandomImage();

const seedDB = async () => {
  // await Campground.deleteMany({});
  for (let i = 0; i < 49; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const imageUrl = await fetchRandomImage(); // Fetch a random image for the campground

    const camp = new Campground({
      author: '64a4f6ea25f4bfda0d69aa0c',
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
      price,
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude
        ]
      },
      images: [
        {
          url: imageUrl,
          filename: 'random-image-filename' // Assign a unique filename for the image
        }
      ]
    });

    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
