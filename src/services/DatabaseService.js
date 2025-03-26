import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

export class DatabaseService {
  constructor() {
    this.database = null;
    this.initDatabase();
  }

  async initDatabase() {
    try {
      this.database = await SQLite.openDatabase({
        name: 'medications.db',
        location: 'default',
      });
      await this.createTables();
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  }

  async createTables() {
    if (!this.database) await this.initDatabase();
    
    try {
      await this.database.executeSql(`
        CREATE TABLE IF NOT EXISTS medications(
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          dosage TEXT,
          frequency TEXT,
          time TEXT,
          instructions TEXT,
          isActive INTEGER
        )
      `);
    } catch (error) {
      console.error('Error creating tables:', error);
    }
  }

  async insertMedication(medication) {
    if (!this.database) await this.initDatabase();
    
    try {
      const { name, dosage, frequency, time, instructions, isActive } = medication;
      const result = await this.database.executeSql(
        `INSERT INTO medications (name, dosage, frequency, time, instructions, isActive) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [name, dosage, frequency, time, instructions, isActive ? 1 : 0]
      );
      return result[0].insertId;
    } catch (error) {
      console.error('Error inserting medication:', error);
      throw error;
    }
  }

  async getMedications() {
    if (!this.database) await this.initDatabase();
    
    try {
      const results = await this.database.executeSql('SELECT * FROM medications');
      const medications = [];
      
      const len = results[0].rows.length;
      for (let i = 0; i < len; i++) {
        const item = results[0].rows.item(i);
        medications.push({
          id: item.id,
          name: item.name,
          dosage: item.dosage,
          frequency: item.frequency,
          time: item.time,
          instructions: item.instructions,
          isActive: item.isActive === 1,
        });
      }
      
      return medications;
    } catch (error) {
      console.error('Error getting medications:', error);
      return [];
    }
  }

  async getMedication(id) {
    if (!this.database) await this.initDatabase();
    
    try {
      const results = await this.database.executeSql(
        'SELECT * FROM medications WHERE id = ?',
        [id]
      );
      
      if (results[0].rows.length > 0) {
        const item = results[0].rows.item(0);
        return {
          id: item.id,
          name: item.name,
          dosage: item.dosage,
          frequency: item.frequency,
          time: item.time,
          instructions: item.instructions,
          isActive: item.isActive === 1,
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting medication:', error);
      return null;
    }
  }

  async updateMedication(medication) {
    if (!this.database) await this.initDatabase();
    
    try {
      const { id, name, dosage, frequency, time, instructions, isActive } = medication;
      await this.database.executeSql(
        `UPDATE medications 
         SET name = ?, dosage = ?, frequency = ?, time = ?, instructions = ?, isActive = ? 
         WHERE id = ?`,
        [name, dosage, frequency, time, instructions, isActive ? 1 : 0, id]
      );
    } catch (error) {
      console.error('Error updating medication:', error);
      throw error;
    }
  }

  async deleteMedication(id) {
    if (!this.database) await this.initDatabase();
    
    try {
      await this.database.executeSql(
        'DELETE FROM medications WHERE id = ?',
        [id]
      );
    } catch (error) {
      console.error('Error deleting medication:', error);
      throw error;
    }
  }

  async toggleMedicationStatus(id, isActive) {
    if (!this.database) await this.initDatabase();
    
    try {
      await this.database.executeSql(
        'UPDATE medications SET isActive = ? WHERE id = ?',
        [isActive ? 1 : 0, id]
      );
    } catch (error) {
      console.error('Error toggling medication status:', error);
      throw error;
    }
  }
}