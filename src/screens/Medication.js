export default class Medication {
    constructor(
      id,
      name,
      dosage,
      frequency,
      time,
      instructions,
      isActive,
      startDate,
      endDate,
      mealOption,
      styleIndex,
      autoReminder
    ) {
      this.id = id;
      this.name = name;
      this.dosage = dosage;
      this.frequency = frequency;
      this.time = time;
      this.instructions = instructions;
      this.isActive = isActive;
      this.startDate = startDate;
      this.endDate = endDate;
      this.mealOption = mealOption;
      this.styleIndex = styleIndex;
      this.autoReminder = autoReminder;
    }
  
    static fromJson(json) {
      return new Medication(
        json.id,
        json.name,
        json.dosage,
        json.frequency,
        json.time,
        json.instructions,
        json.isActive,
        json.startDate,
        json.endDate,
        json.mealOption,
        json.styleIndex,
        json.autoReminder
      );
    }
  
    toJson() {
      return {
        id: this.id,
        name: this.name,
        dosage: this.dosage,
        frequency: this.frequency,
        time: this.time,
        instructions: this.instructions,
        isActive: this.isActive,
        startDate: this.startDate,
        endDate: this.endDate,
        mealOption: this.mealOption,
        styleIndex: this.styleIndex,
        autoReminder: this.autoReminder,
      };
    }
  }