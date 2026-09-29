import 'dotenv/config'
import pg from 'pg'

const client = new pg.Client({ connectionString: process.env.DATABASE_URL })

const statements = `
CREATE TABLE IF NOT EXISTS public.internship_certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_id varchar(30) NOT NULL UNIQUE,
  name varchar(200) NOT NULL,
  email varchar(320) NOT NULL,
  internship_field varchar(200) NOT NULL,
  performance varchar(200) NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  file_url varchar(500) NOT NULL,
  public_id varchar(300) NOT NULL,
  file_type varchar(20) NOT NULL,
  issued_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS internship_certificates_email_idx ON public.internship_certificates (email);
CREATE INDEX IF NOT EXISTS internship_certificates_name_idx ON public.internship_certificates (name);
CREATE INDEX IF NOT EXISTS internship_certificates_created_at_idx ON public.internship_certificates (created_at DESC);

CREATE TABLE IF NOT EXISTS public.certificate_counters (
  id integer PRIMARY KEY DEFAULT 1,
  value integer NOT NULL DEFAULT 0
);

INSERT INTO public.certificate_counters (id, value)
VALUES (1, 0)
ON CONFLICT (id) DO NOTHING;
`

async function main() {
  try {
    await client.connect()
    await client.query(statements)
    console.log('Certificate tables ready.')
  } finally {
    await client.end()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})