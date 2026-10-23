# Générateur de QR codes avec historique

Application web réalisée avec **AdonisJS 7** (kit `hypermedia`) dans le cadre du cours « Développement back-end avancé » (MMI 3).

Un utilisateur crée un compte, génère des QR codes à partir d'un lien ou d'un texte, choisit leurs couleurs, leur taille et leur niveau de correction d'erreur, puis les télécharge en PNG. Chaque utilisateur retrouve ses QR codes dans un historique personnel, où il peut les modifier ou les supprimer.

## Fonctionnalités

- **Comptes** : inscription, connexion et déconnexion (session par cookie). Les pages des QR codes sont réservées aux utilisateurs connectés.
- **Création d'un QR code** :
  - type « Lien » (URL obligatoirement en `http://` ou `https://`) ou « Texte libre » (retours à la ligne conservés), 400 caractères maximum ;
  - titre facultatif (sinon, le début du contenu sert de titre) ;
  - couleur des modules et du fond, taille de 100 à 1000 pixels, niveau de correction d'erreur L, M, Q ou H.
- **Historique** : tous les QR codes de l'utilisateur, du plus récent au plus ancien, avec un aperçu de chacun.
- **Détail** : image en taille réelle, caractéristiques, **téléchargement en PNG**.
- **Modification** avec le même formulaire, prérempli.
- **Suppression** avec demande de confirmation.
- **Validation côté serveur** avec des messages en français sous chaque champ ; les valeurs saisies sont conservées en cas d'erreur.
- **Sécurité** : un utilisateur ne peut ni voir, ni modifier, ni supprimer les QR codes d'un autre (réponse 404) ; protection CSRF sur tous les formulaires.
- Interface en français, adaptée aux écrans de téléphone.

## Technologies utilisées

| Outil | Rôle |
| --- | --- |
| [AdonisJS 7](https://docs.adonisjs.com) (kit `hypermedia`) | Framework back-end : routes, contrôleurs, middlewares, sessions |
| TypeScript | Langage du serveur |
| Lucid ORM + SQLite (`better-sqlite3`) | Base de données, modèles et migrations |
| VineJS 4 | Validation des formulaires |
| Edge.js | Moteur de templates (vues HTML rendues côté serveur) |
| Alpine.js | Petites interactions côté navigateur (choix du type, confirmation de suppression) |
| [`qrcode`](https://www.npmjs.com/package/qrcode) | Génération des images PNG des QR codes |
| Luxon | Formatage des dates en français |
| Vite | Compilation du CSS et du JavaScript |

## Installation et lancement

Prérequis : **Node.js 24** ou plus récent, et npm.

> Le chemin du projet peut contenir des espaces ou des accents : mettez-le toujours entre guillemets dans le terminal.

1. Cloner le dépôt et entrer dans le dossier :

   ```bash
   git clone https://github.com/Chalinger/QR-Code-Generator---AdonisJS-MMI3.git
   cd QR-Code-Generator---AdonisJS-MMI3
   ```

2. Installer les dépendances :

   ```bash
   npm install
   ```

   Sous Windows, sans les outils C++ de Visual Studio, l'installation s'arrête sur `better-sqlite3` avec `gyp ERR! find VS could not find a version of Visual Studio`. Relancez-la alors avec :

   ```bash
   npm install --ignore-scripts
   ```

   C'est sans risque ici : `better-sqlite3` contient déjà ses binaires précompilés (`prebuilds/win32-x64.node`), mais npm tente quand même de le recompiler lors d'une installation à partir de `package-lock.json`. Ne copiez jamais le dossier `node_modules` d'un projet à l'autre.

3. Créer le fichier `.env` à partir de l'exemple, puis générer la clé de l'application (`APP_KEY`) :

   ```bash
   cp .env.example .env
   ```

   (sous PowerShell : `Copy-Item .env.example .env`)

   ```bash
   node ace generate:key
   ```

4. Créer les tables de la base SQLite (`tmp/db.sqlite3`) :

   ```bash
   node ace migration:run
   ```

5. Lancer le serveur de développement :

   ```bash
   npm run dev
   ```

   puis ouvrir <http://localhost:3333> et créer un compte.

### Autres commandes utiles

| Commande | Rôle |
| --- | --- |
| `node ace list:routes` | Liste des routes, avec leur nom, leur contrôleur et leurs middlewares |
| `node ace migration:fresh` | Supprime toutes les tables et rejoue les migrations (les données sont perdues) |
| `npm run typecheck` | Vérification TypeScript |
| `npm run lint` | ESLint et Prettier |

## Routes principales

| Méthode | URL | Rôle |
| --- | --- | --- |
| GET | `/` | Accueil |
| GET, POST | `/signup` | Inscription |
| GET, POST | `/login` | Connexion |
| POST | `/logout` | Déconnexion |
| GET | `/qr-codes` | Historique |
| GET | `/qr-codes/create` | Formulaire de création |
| POST | `/qr-codes` | Enregistrement d'un nouveau QR code |
| GET | `/qr-codes/:id` | Détail et téléchargement |
| GET | `/qr-codes/:id/edit` | Formulaire de modification |
| PUT | `/qr-codes/:id` | Enregistrement des modifications |
| DELETE | `/qr-codes/:id` | Suppression |

Les routes `/qr-codes` sont protégées par le middleware `auth`. Les formulaires HTML ne sachant envoyer que `GET` et `POST`, `PUT` et `DELETE` passent par le *method spoofing* (`POST /qr-codes/1?_method=PUT`).

## Organisation du code

| Fichier | Contenu |
| --- | --- |
| `database/migrations/…_create_qr_codes_table.ts` | Table `qr_codes` (propriétaire, type, contenu, couleurs, taille, niveau de correction) |
| `app/models/qr_code.ts`, `app/models/user.ts` | Modèles et relations (un utilisateur a plusieurs QR codes) |
| `app/validators/qr_code.ts` | Règles de validation d'un QR code |
| `start/validator.ts` | Messages d'erreur en français pour tous les validateurs |
| `app/controllers/qr_codes_controller.ts` | Contrôleur ressource (les 7 méthodes du CRUD) |
| `app/services/qr_code_generator.ts` | Génération de l'image PNG (data URL) |
| `start/routes.ts` | Déclaration des routes |
| `resources/views/pages/qr_codes/` | Vues de l'historique, du détail, de la création et de la modification |
| `resources/views/components/qr_code_form.edge` | Formulaire partagé par la création et la modification |
| `resources/css/app.css` | Feuille de style |

L'image d'un QR code n'est pas stockée : elle est recalculée à partir de ses caractéristiques à chaque affichage.