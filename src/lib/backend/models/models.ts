import mongoose, { Schema } from 'mongoose';

const adresseSchema = new Schema({
  AdresseID: { type: Schema.Types.ObjectId, auto: true },
  UtilisateurID: { type: Schema.Types.ObjectId, ref: 'Utilisateur' },
  LigneAdresse1: { type: String, required: true },
  LigneAdresse2: { type: String },
  Ville: { type: String, required: true },
  Etat: { type: String, required: true },
  CodePostal: { type: String, required: true },
  Pays: { type: String, required: true },
}, { timestamps: true });

adresseSchema.index({ UtilisateurID: 1 });

const avisSchema = new Schema({
  AvisID: { type: Schema.Types.ObjectId, auto: true },
  ProduitID: { type: Schema.Types.ObjectId, ref: 'Produit' },
  ClientID: { type: Schema.Types.ObjectId, ref: 'Utilisateur' },
  Note: { type: Number, min: 1, max: 5 },
  Commentaire: { type: String },
}, { timestamps: true });

const categorieSchema = new Schema({
  CategorieID: { type: Schema.Types.ObjectId, auto: true },
  Nom: { type: String, required: true },
  Description: { type: String },
}, { timestamps: true });

categorieSchema.index({ Nom: 1 });

const commandeArticleSchema = new Schema({
  CommandeArticleID: { type: Schema.Types.ObjectId, auto: true },
  CommandeID: { type: Schema.Types.ObjectId, ref: 'Commande' },
  ProduitID: { type: Schema.Types.ObjectId, ref: 'Produit' },
  Quantite: { type: Number, required: true },
  Prix: { type: Number, required: true },
});

const commandeSchema = new Schema({
  CommandeID: { type: Schema.Types.ObjectId, auto: true },
  ClientID: { type: Schema.Types.ObjectId, ref: 'Utilisateur' },
  Statut: {
    type: String,
    enum: ['En attente', 'Traitee', 'Expediee', 'Livree', 'Annulee'],
    default: 'En attente',
  },
  MontantTotal: { type: Number },
}, { timestamps: true });

commandeSchema.index({ ClientID: 1, Statut: 1 });

const expeditionSchema = new Schema({
  ExpeditionID: { type: Schema.Types.ObjectId, auto: true },
  CommandeID: { type: Schema.Types.ObjectId, ref: 'Commande' },
  AdresseID: { type: Schema.Types.ObjectId, ref: 'Adresse' },
  DateExpedition: { type: Date },
  DateLivraison: { type: Date },
  Statut: {
    type: String,
    enum: ['En attente', 'Expediee', 'Livree'],
    default: 'En attente',
  },
}, { timestamps: true });

const inventaireSchema = new Schema({
  InventaireID: { type: Schema.Types.ObjectId, auto: true },
  ProduitID: { type: Schema.Types.ObjectId, ref: 'Produit' },
  VendeurID: { type: Schema.Types.ObjectId, ref: 'Utilisateur' },
  Quantite: { type: Number, required: true },
});

const paiementSchema = new Schema({
  PaiementID: { type: Schema.Types.ObjectId, auto: true },
  CommandeID: { type: Schema.Types.ObjectId, ref: 'Commande' },
  MethodePaiement: {
    type: String,
    enum: ['Carte de crédit', 'PayPal', 'Virement bancaire'],
  },
  Montant: { type: Number, required: true },
}, { timestamps: true });

const produitSchema = new Schema({
  ProduitID: { type: Schema.Types.ObjectId, auto: true },
  VendeurID: { type: Schema.Types.ObjectId, ref: 'Utilisateur' },
  Nom: { type: String, required: true },
  Description: { type: String },
  Prix: { type: Number, required: true },
  Stock: { type: Number, required: true },
  CategorieID: { type: Schema.Types.ObjectId, ref: 'Categorie' },
  Disponible: { type: Boolean, default: true },
}, { timestamps: true });

produitSchema.index({ Nom: 1 });

const utilisateurSchema = new Schema({
  UtilisateurID: { type: Schema.Types.ObjectId, auto: true },
  NomUtilisateur: { type: String, required: true },
  PrenomUtilisateur: { type: String, required: true },
  MotDePasseHash: { type: String, required: true },
  EmailUtilisateur: { type: String, required: true, unique: true },
  NumeroTelephone: { type: String },
  TypeUtilisateur: {
    type: String,
    enum: ['client', 'vendeur', 'admin'],
    required: true,
  },
  avatarImage: { type: String }, 
}, { timestamps: true });


utilisateurSchema.index({ EmailUtilisateur: 1 });

const Adresse = mongoose.models.Adresse || mongoose.model('Adresse', adresseSchema);
const Avis = mongoose.models.Avis || mongoose.model('Avis', avisSchema);
const Categorie = mongoose.models.Categorie || mongoose.model('Categorie', categorieSchema);
const CommandeArticle = mongoose.models.CommandeArticle || mongoose.model('CommandeArticle', commandeArticleSchema);
const Commande = mongoose.models.Commande || mongoose.model('Commande', commandeSchema);
const Expedition = mongoose.models.Expedition || mongoose.model('Expedition', expeditionSchema);
const Inventaire = mongoose.models.Inventaire || mongoose.model('Inventaire', inventaireSchema);
const Paiement = mongoose.models.Paiement || mongoose.model('Paiement', paiementSchema);
const Produit = mongoose.models.Produit || mongoose.model('Produit', produitSchema);
const Utilisateur = mongoose.models.Utilisateur || mongoose.model('Utilisateur', utilisateurSchema);

export {
  Adresse,
  Avis,
  Categorie,
  CommandeArticle,
  Commande,
  Expedition,
  Inventaire,
  Paiement,
  Produit,
  Utilisateur,
};
