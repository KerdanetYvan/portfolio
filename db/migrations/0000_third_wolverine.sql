CREATE SCHEMA IF NOT EXISTS "portfolio";
--> statement-breakpoint
CREATE TYPE "portfolio"."statut_contact" AS ENUM('non_lu', 'lu', 'repondu', 'archive');--> statement-breakpoint
CREATE TYPE "portfolio"."type_demande" AS ENUM('alternance', 'mission_freelance', 'question', 'autre');--> statement-breakpoint
CREATE TYPE "portfolio"."statut_apprentissage" AS ENUM('en_cours', 'termine', 'abandonne');--> statement-breakpoint
CREATE TYPE "portfolio"."couleur" AS ENUM('vert', 'jaune', 'rouge');--> statement-breakpoint
CREATE TYPE "portfolio"."statut_code" AS ENUM('recherche', 'cale', 'occupe', 'pause');--> statement-breakpoint
CREATE TABLE "portfolio"."contact_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nom" text NOT NULL,
	"email" text NOT NULL,
	"type_demande" "portfolio"."type_demande" NOT NULL,
	"entreprise" text,
	"message" text NOT NULL,
	"date_reception" timestamp with time zone DEFAULT now() NOT NULL,
	"statut" "portfolio"."statut_contact" DEFAULT 'non_lu' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "portfolio"."learning_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nom" text NOT NULL,
	"categorie" text NOT NULL,
	"description" text NOT NULL,
	"date_debut" date NOT NULL,
	"lien" text,
	"statut" "portfolio"."statut_apprentissage" DEFAULT 'en_cours' NOT NULL,
	"ordre" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "portfolio"."status" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"statut_code" "portfolio"."statut_code" NOT NULL,
	"libelle" text NOT NULL,
	"couleur" "portfolio"."couleur" NOT NULL,
	"date_modif" timestamp with time zone DEFAULT now() NOT NULL,
	"actif" boolean DEFAULT false NOT NULL
);
