import axios from 'axios';
import { ENDPOINTS } from '@shared/constants/index';

// eslint-disable-next-line consistent-return
export const sendMail = async (email, code) => {
  try {
    const { data } = await axios({
      method: code ? 'POST' : 'GET',
      url: `${ENDPOINTS.VERIFY_EMAIL}/verify`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        platform: 'mail',
        to: email,
        verificationCode: code,
      },
    });
    return data;
  } catch (error) {
    console.log('error', error);
  }
};
