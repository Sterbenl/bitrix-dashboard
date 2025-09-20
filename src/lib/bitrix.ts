interface BitrixContact {
  NAME: string;
  LAST_NAME: string;
  EMAIL: string;
  PHONE?: string;
}

interface BitrixResponse {
  result: any;
  error?: {
    error: string;
    error_description: string;
  };
}

class BitrixAPI {
  private webhookUrl: string;

  constructor(webhookUrl: string) {
    this.webhookUrl = webhookUrl;
  }

  async createContact(contact: BitrixContact): Promise<number | null> {
    try {
      const response = await fetch(`${this.webhookUrl}/crm.contact.add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: {
            NAME: contact.NAME,
            LAST_NAME: contact.LAST_NAME,
            EMAIL: [{ VALUE: contact.EMAIL, VALUE_TYPE: 'WORK' }],
            PHONE: contact.PHONE ? [{ VALUE: contact.PHONE, VALUE_TYPE: 'WORK' }] : undefined,
          },
        }),
      });

      const data: BitrixResponse = await response.json();

      if (data.error) {
        console.error('Bitrix API Error:', data.error);
        return null;
      }

      return data.result;
    } catch (error) {
      console.error('Error creating Bitrix contact:', error);
      return null;
    }
  }

  async updateContact(contactId: number, contact: BitrixContact): Promise<boolean> {
    try {
      const response = await fetch(`${this.webhookUrl}/crm.contact.update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: contactId,
          fields: {
            NAME: contact.NAME,
            LAST_NAME: contact.LAST_NAME,
            EMAIL: [{ VALUE: contact.EMAIL, VALUE_TYPE: 'WORK' }],
            PHONE: contact.PHONE ? [{ VALUE: contact.PHONE, VALUE_TYPE: 'WORK' }] : undefined,
          },
        }),
      });

      const data: BitrixResponse = await response.json();

      if (data.error) {
        console.error('Bitrix API Error:', data.error);
        return false;
      }

      return data.result;
    } catch (error) {
      console.error('Error updating Bitrix contact:', error);
      return false;
    }
  }

  async getContact(contactId: number): Promise<BitrixContact | null> {
    try {
      const response = await fetch(`${this.webhookUrl}/crm.contact.get`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: contactId,
        }),
      });

      const data: BitrixResponse = await response.json();

      if (data.error) {
        console.error('Bitrix API Error:', data.error);
        return null;
      }

      return data.result;
    } catch (error) {
      console.error('Error getting Bitrix contact:', error);
      return null;
    }
  }
}

export default BitrixAPI;
export type { BitrixContact };
