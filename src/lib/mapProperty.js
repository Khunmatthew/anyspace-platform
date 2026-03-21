// Map Supabase DB row → frontend property shape
export function mapProperty(row) {
  const loc = [row.district, row.city].filter(Boolean).join(', ')
  return {
    id: row.id,
    type: row.type,
    listing_type: row.listing_type,
    title: {
      zh: row.title_zh || '',
      en: row.title_en || row.title_zh || '',
      th: row.title_th || row.title_zh || '',
    },
    description: {
      zh: row.description_zh || '',
      en: row.description_en || row.description_zh || '',
      th: '',
    },
    location: { zh: loc, en: loc, th: loc },
    price: row.price,
    size: row.size,
    floor: row.floor || '',
    furnished: row.furnished || false,
    btsNearby: row.bts_nearby || false,
    canRegister: row.can_register || false,
    parking: row.parking || 0,
    deposit: row.deposit || '2 months',
    minLease: row.min_lease || '1 year',
    managementFee: row.cam_fee || 0,
    pricePerSqm: row.size ? Math.round(row.price / row.size) : 0,
    image: row.image || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
    images: row.images?.length
      ? row.images
      : [row.image || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'],
    features: row.features || [],
    highlights: { zh: [], en: [] },
    suitableFor: { zh: [], en: [] },
    agent: {
      name: row.contact_name || 'AnySpace',
      image: `https://api.dicebear.com/7.x/personas/svg?seed=${row.contact_name || 'anyspace'}`,
    },
    contact: {
      name: row.contact_name,
      phone: row.contact_phone,
      wechat: row.contact_wechat,
      whatsapp: row.contact_whatsapp,
      line: row.contact_line,
      email: row.contact_email,
    },
    status: row.status,
    created_at: row.created_at,
  }
}
