import api from './api';

export const getPromotions = async () => {
  try {
    const { data } = await api.get('/promotions');
    return data;
  } catch (err) {
    return [
      { id: 1, title: 'Caprese Kit', items: ['Tomatoes','Mozzarella','Basil'], discount: '25%' },
      { id: 2, title: 'Salmon Dinner', items: ['Salmon Fillet','Lemon'], discount: '20%' }
    ];
  }
};

export const activatePromotion = async (id) => {
  try {
    const { data } = await api.post(`/promotions/${id}/activate`);
    return data;
  } catch (err) {
    return { success: true };
  }
};

export default { getPromotions, activatePromotion };
