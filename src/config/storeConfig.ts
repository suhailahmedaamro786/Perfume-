/**
 * Central Brand, Delivery & Ordering Configuration for SK PERFUMES
 * Edit this file to adjust delivery charges, free delivery thresholds, or contact details.
 */

export const STORE_CONFIG = {
  brandName: 'SK PERFUMES',
  tagline: 'Luxury Fragrances. Timeless Elegance.',
  currencyCode: 'PKR',
  currencySymbol: 'Rs.',
  whatsappNumber: '923041333131', // Format required for wa.me links
  whatsappDisplay: '+92 304 1333131',
  supportHours: 'Monday – Saturday, 10:00 AM to 8:00 PM PKT',

  /**
   * Delivery Charge Rules (in PKR)
   * - Orders with a subtotal >= freeDeliveryThreshold qualify for complimentary standard delivery (Rs. 0).
   * - Orders below the threshold are charged according to city tier:
   *   - Major Metro Cities (Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar, Quetta): Rs. 250
   *   - All Other Cities & Towns across Pakistan: Rs. 350
   */
  delivery: {
    freeDeliveryThreshold: 10000,
    majorCitiesFee: 250,
    otherCitiesFee: 350,
    estimatedDispatchDays: '1 – 2 working days after seller confirmation on WhatsApp',
    estimatedTransitDays: '2 – 5 working days depending on destination city',
    majorCities: [
      'Karachi',
      'Lahore',
      'Islamabad',
      'Rawalpindi',
      'Faisalabad',
      'Multan',
      'Peshawar',
      'Quetta',
      'Sialkot',
      'Gujranwala',
      'Hyderabad',
    ],
  },

  popularCities: [
    'Karachi',
    'Lahore',
    'Islamabad',
    'Rawalpindi',
    'Faisalabad',
    'Multan',
    'Peshawar',
    'Quetta',
    'Sialkot',
    'Gujranwala',
    'Hyderabad',
    'Bahawalpur',
    'Sargodha',
    'Abbottabad',
    'Sukkur',
    'Mardan',
    'Mirpur',
    'Muzaffarabad',
    'Gwadar',
    'Other City',
  ],
} as const;
