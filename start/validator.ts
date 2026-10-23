/*
|--------------------------------------------------------------------------
| Validator file
|--------------------------------------------------------------------------
|
| The validator file is used for configuring global transforms for VineJS.
| The transform below converts all VineJS date outputs from JavaScript
| Date objects to Luxon DateTime instances, so that validated dates are
| ready to use with Lucid models and other parts of the app that expect
| Luxon DateTime.
|
*/

import { DateTime } from 'luxon'
import { VineDate } from '@vinejs/vine'
import vine, { SimpleMessagesProvider } from '@vinejs/vine'

declare module '@vinejs/vine/types' {
  interface VineGlobalTransforms {
    date: DateTime
  }
}

VineDate.transform((value) => DateTime.fromJSDate(value))

/**
 * Messages d'erreur en français, pour tous les validateurs de l'application.
 * VineJS cherche d'abord un message "champ.règle", puis "règle" seule.
 * Ce fichier est préchargé (preloads dans adonisrc.ts) : le fournisseur est
 * donc en place avant la création des validateurs avec vine.create().
 */
vine.messagesProvider = new SimpleMessagesProvider({
  // Messages génériques
  'required': 'Ce champ est obligatoire.',
  'string': 'Ce champ doit être un texte.',
  'email': 'Saisissez une adresse e-mail valide.',
  'url': 'Saisissez une URL valide commençant par http:// ou https://.',
  'regex': "Le format de ce champ n'est pas valide.",
  'minLength': 'Saisissez au moins {{ min }} caractères.',
  'maxLength': 'Saisissez au maximum {{ max }} caractères.',
  'number': 'Saisissez un nombre.',
  'withoutDecimals': 'Saisissez un nombre entier.',
  'range': 'Saisissez une valeur comprise entre {{ min }} et {{ max }}.',
  'enum': 'Choisissez une des valeurs proposées.',
  'sameAs': 'Les deux valeurs ne correspondent pas.',

  // QR codes
  'type.enum': 'Choisissez un type de contenu : lien ou texte libre.',
  'foregroundColor.regex': 'Couleur invalide : le format attendu est #rrggbb.',
  'backgroundColor.regex': 'Couleur invalide : le format attendu est #rrggbb.',
  'size.range': 'La taille doit être comprise entre {{ min }} et {{ max }} pixels.',
  'errorCorrection.enum': 'Choisissez un niveau de correction : L, M, Q ou H.',

  // Inscription et connexion
  'email.database.unique': 'Un compte existe déjà avec cette adresse e-mail.',
  'passwordConfirmation.sameAs': 'Les deux mots de passe ne correspondent pas.',
})
