ALTER TABLE "cv"."projets_meta" DROP COLUMN "nom";--> statement-breakpoint
ALTER TABLE "cv"."projets_meta" DROP COLUMN "description";--> statement-breakpoint
ALTER TABLE "cv"."projets_meta" DROP COLUMN "technologies";--> statement-breakpoint
ALTER TABLE "cv"."projets_meta" DROP COLUMN "url_demo";--> statement-breakpoint
ALTER TABLE "cv"."projets_meta" DROP COLUMN "url_repo";--> statement-breakpoint
ALTER TABLE "cv"."projets_meta" DROP COLUMN "visible";--> statement-breakpoint
ALTER TABLE "cv"."projets_meta" ADD COLUMN "github_repo_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "cv"."projets_meta" ADD COLUMN "description_cv" text;--> statement-breakpoint
ALTER TABLE "cv"."projets_meta" ADD COLUMN "tags" text[];--> statement-breakpoint
ALTER TABLE "cv"."projets_meta" ADD COLUMN "inclure_par_defaut" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "cv"."projets_meta" ADD COLUMN "date_modif" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "cv"."projets_meta" ADD CONSTRAINT "projets_meta_github_repo_id_unique" UNIQUE("github_repo_id");
