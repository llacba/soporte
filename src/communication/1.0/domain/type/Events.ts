export enum HIGH_PRIORITY_EVENTS {
  CONTACT_COORDINATOR = 'Contacto coordinador',
  MISSING_AUDITORS = 'Faltan fiscales',
  REPLACEMENT_REQUESTED = 'Necesito reemplazo'
}

export enum LOW_PRIORITY_EVENTS {
  APP_ISSUES = 'Fallas en la app',
  FOOD_OR_DRINK = 'Comida o bebida',
  OTHER_ISSUE = 'Otro problema'
}

export enum MEDIUM_PRIORITY_EVENTS {
  CONFLICTING_AUDITORS = 'Conflicto - fiscales',
  DOUBTS = 'Dudas',
  INCORRECT_DATA = 'Datos mal cargados',
  SCHOOL_PROBLEMS = 'Problemas en escuela'
}

export type EVENTS = HIGH_PRIORITY_EVENTS | LOW_PRIORITY_EVENTS | MEDIUM_PRIORITY_EVENTS;
