'use server';
import 'server-only';

import { getDbConnection, type DbCredentials } from "@/lib/db";
import { z } from "zod";
import { promises as fs } from 'fs';
import path from 'path';

// Zod schema for validation
const dbCredentialsSchema = z.object({
  host: z.string().min(1, 'Host é obrigatório'),
  port: z.coerce.number().min(1, 'Porta é obrigatória'),
  user: z.string().min(1, 'Usuário é obrigatório'),
  password: z.string().optional(),
  database: z.string().min(1, 'Nome do banco de dados é obrigatório'),
});


// Definições das tabelas
const createUsersTableQuery = `
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  plan VARCHAR(50) DEFAULT 'free',
  role VARCHAR(50) DEFAULT 'user',
  custom_alert TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

const createProjectsTableQuery = `
CREATE TABLE IF NOT EXISTS projects (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  url VARCHAR(255) NOT NULL,
  fb_pixel_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
`;

const createSettingsTableQuery = `
CREATE TABLE IF NOT EXISTS settings (
  setting_key VARCHAR(255) PRIMARY KEY,
  setting_value TEXT
);
`;

const createSubscriptionsTableQuery = `
CREATE TABLE IF NOT EXISTS subscriptions (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  plan VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL,
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  gateway_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
`;

const createFunnelStepsTableQuery = `
CREATE TABLE IF NOT EXISTS funnel_steps (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  url_path VARCHAR(2048) NOT NULL,
  step_order INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
`;

const createCloakerRulesTableQuery = `
CREATE TABLE IF NOT EXISTS cloaker_rules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id VARCHAR(255) NOT NULL,
  conditions TEXT NOT NULL,
  redirect_url VARCHAR(2048) NOT NULL,
  priority INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
`;

const createSecurityLogsTableQuery = `
CREATE TABLE IF NOT EXISTS security_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id VARCHAR(255) NOT NULL,
  ip_address VARCHAR(45),
  country_code VARCHAR(2),
  country_name VARCHAR(100),
  user_agent TEXT,
  reason VARCHAR(255),
  is_critical BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
`;

const createNotificationsTableQuery = `
CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  cta_text VARCHAR(255),
  cta_href VARCHAR(2048),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
`;

const createProjectSettingsTableQuery = `
CREATE TABLE IF NOT EXISTS project_settings (
  project_id VARCHAR(255) PRIMARY KEY,
  cloaker_config TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
`;

const createAnalyticsVisitsTableQuery = `
CREATE TABLE IF NOT EXISTS analytics_visits (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  project_id VARCHAR(255) NOT NULL,
  session_id VARCHAR(255) NOT NULL,
  path VARCHAR(2048) NOT NULL,
  referrer VARCHAR(2048),
  user_agent TEXT,
  country_code VARCHAR(2),
  device_type VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  KEY project_id_idx (project_id),
  KEY session_id_idx (session_id)
);
`;

const createCountriesTableQuery = `
CREATE TABLE IF NOT EXISTS countries (
    code CHAR(2) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    emoji VARCHAR(10) NOT NULL
);
`;

const insertCountriesDataQuery = `
INSERT IGNORE INTO countries (code, name, emoji) VALUES
('AD', 'Andorra', '🇦🇩'), ('AE', 'United Arab Emirates', '🇦🇪'), ('AF', 'Afghanistan', '🇦🇫'),
('AG', 'Antigua and Barbuda', '🇦🇬'), ('AI', 'Anguilla', '🇦🇮'), ('AL', 'Albania', '🇦🇱'),
('AM', 'Armenia', '🇦🇲'), ('AO', 'Angola', '🇦🇴'), ('AQ', 'Antarctica', '🇦🇶'),
('AR', 'Argentina', '🇦🇷'), ('AS', 'American Samoa', '🇦🇸'), ('AT', 'Austria', '🇦🇹'),
('AU', 'Australia', '🇦🇺'), ('AW', 'Aruba', '🇦🇼'), ('AX', 'Åland Islands', '🇦🇽'),
('AZ', 'Azerbaijan', '🇦🇿'), ('BA', 'Bosnia and Herzegovina', '🇧🇦'), ('BB', 'Barbados', '🇧🇧'),
('BD', 'Bangladesh', '🇧🇩'), ('BE', 'Belgium', '🇧🇪'), ('BF', 'Burkina Faso', '🇧🇫'),
('BG', 'Bulgaria', '🇧🇬'), ('BH', 'Bahrain', '🇧🇭'), ('BI', 'Burundi', '🇧🇮'),
('BJ', 'Benin', '🇧🇯'), ('BL', 'Saint Barthélemy', '🇧🇱'), ('BM', 'Bermuda', '🇧🇲'),
('BN', 'Brunei Darussalam', '🇧🇳'), ('BO', 'Bolivia', '🇧🇴'), ('BQ', 'Bonaire, Sint Eustatius and Saba', '🇧🇶'),
('BR', 'Brazil', '🇧🇷'), ('BS', 'Bahamas', '🇧🇸'), ('BT', 'Bhutan', '🇧🇹'),
('BV', 'Bouvet Island', '🇧🇻'), ('BW', 'Botswana', '🇧🇼'), ('BY', 'Belarus', '🇧🇾'),
('BZ', 'Belize', '🇧🇿'), ('CA', 'Canada', '🇨🇦'), ('CC', 'Cocos (Keeling) Islands', '🇨🇨'),
('CD', 'Congo, Democratic Republic of the', '🇨🇩'), ('CF', 'Central African Republic', '🇨🇫'), ('CG', 'Congo', '🇨🇬'),
('CH', 'Switzerland', '🇨🇭'), ('CI', 'Côte d''Ivoire', '🇨🇮'), ('CK', 'Cook Islands', '🇨🇰'),
('CL', 'Chile', '🇨🇱'), ('CM', 'Cameroon', '🇨🇲'), ('CN', 'China', '🇨🇳'),
('CO', 'Colombia', '🇨🇴'), ('CR', 'Costa Rica', '🇨🇷'), ('CU', 'Cuba', '🇨🇺'),
('CV', 'Cabo Verde', '🇨🇻'), ('CW', 'Curaçao', '🇨🇼'), ('CX', 'Christmas Island', '🇨🇽'),
('CY', 'Cyprus', '🇨🇾'), ('CZ', 'Czechia', '🇨🇿'), ('DE', 'Germany', '🇩🇪'),
('DJ', 'Djibouti', '🇩🇯'), ('DK', 'Denmark', '🇩🇰'), ('DM', 'Dominica', '🇩🇲'),
('DO', 'Dominican Republic', '🇩🇴'), ('DZ', 'Algeria', '🇩🇿'), ('EC', 'Ecuador', '🇪🇨'),
('EE', 'Estonia', '🇪🇪'), ('EG', 'Egypt', '🇪🇬'), ('EH', 'Western Sahara', '🇪🇭'),
('ER', 'Eritrea', '🇪🇷'), ('ES', 'Spain', '🇪🇸'), ('ET', 'Ethiopia', '🇪🇹'),
('FI', 'Finland', '🇫🇮'), ('FJ', 'Fiji', '🇫🇯'), ('FK', 'Falkland Islands (Malvinas)', '🇫🇰'),
('FM', 'Micronesia (Federated States of)', '🇫🇲'), ('FO', 'Faroe Islands', '🇫🇴'), ('FR', 'France', '🇫🇷'),
('GA', 'Gabon', '🇬🇦'), ('GB', 'United Kingdom', '🇬🇧'), ('GD', 'Grenada', '🇬🇩'),
('GE', 'Georgia', '🇬🇪'), ('GF', 'French Guiana', '🇬🇫'), ('GG', 'Guernsey', '🇬🇬'),
('GH', 'Ghana', '🇬🇭'), ('GI', 'Gibraltar', '🇬🇮'), ('GL', 'Greenland', '🇬🇱'),
('GM', 'Gambia', '🇬🇲'), ('GN', 'Guinea', '🇬🇳'), ('GP', 'Guadeloupe', '🇬🇵'),
('GQ', 'Equatorial Guinea', '🇬🇶'), ('GR', 'Greece', '🇬🇷'), ('GS', 'South Georgia and the South Sandwich Islands', '🇬🇸'),
('GT', 'Guatemala', '🇬🇹'), ('GU', 'Guam', '🇬🇺'), ('GW', 'Guinea-Bissau', '🇬🇼'),
('GY', 'Guyana', '🇬🇾'), ('HK', 'Hong Kong', '🇭🇰'), ('HM', 'Heard Island and McDonald Islands', '🇭🇲'),
('HN', 'Honduras', '🇭🇳'), ('HR', 'Croatia', '🇭🇷'), ('HT', 'Haiti', '🇭🇹'),
('HU', 'Hungary', '🇭🇺'), ('ID', 'Indonesia', '🇮🇩'), ('IE', 'Ireland', '🇮🇪'),
('IL', 'Israel', '🇮🇱'), ('IM', 'Isle of Man', '🇮🇲'), ('IN', 'India', '🇮🇳'),
('IO', 'British Indian Ocean Territory', '🇮🇴'), ('IQ', 'Iraq', '🇮🇶'), ('IR', 'Iran', '🇮🇷'),
('IS', 'Iceland', '🇮🇸'), ('IT', 'Italy', '🇮🇹'), ('JE', 'Jersey', '🇯🇪'),
('JM', 'Jamaica', '🇯🇲'), ('JO', 'Jordan', '🇯🇴'), ('JP', 'Japan', '🇯🇵'),
('KE', 'Kenya', '🇰🇪'), ('KG', 'Kyrgyzstan', '🇰🇬'), ('KH', 'Cambodia', '🇰🇭'),
('KI', 'Kiribati', '🇰🇮'), ('KM', 'Comoros', '🇰🇲'), ('KN', 'Saint Kitts and Nevis', '🇰🇳'),
('KP', 'North Korea', '🇰🇵'), ('KR', 'South Korea', '🇰🇷'), ('KW', 'Kuwait', '🇰🇼'),
('KY', 'Cayman Islands', '🇰🇾'), ('KZ', 'Kazakhstan', '🇰🇿'), ('LA', 'Lao People''s Democratic Republic', '🇱🇦'),
('LB', 'Lebanon', '🇱🇧'), ('LC', 'Saint Lucia', '🇱🇨'), ('LI', 'Liechtenstein', '🇱🇮'),
('LK', 'Sri Lanka', '🇱🇰'), ('LR', 'Liberia', '🇱🇷'), ('LS', 'Lesotho', '🇱🇸'),
('LT', 'Lithuania', '🇱🇹'), ('LU', 'Luxembourg', '🇱🇺'), ('LV', 'Latvia', '🇱🇻'),
('LY', 'Libya', '🇱🇾'), ('MA', 'Morocco', '🇲🇦'), ('MC', 'Monaco', '🇲🇨'),
('MD', 'Moldova', '🇲🇩'), ('ME', 'Montenegro', '🇲🇪'), ('MF', 'Saint Martin (French part)', '🇲🇫'),
('MG', 'Madagascar', '🇲🇬'), ('MH', 'Marshall Islands', '🇲🇭'), ('MK', 'North Macedonia', '🇲🇰'),
('ML', 'Mali', '🇲🇱'), ('MM', 'Myanmar', '🇲🇲'), ('MN', 'Mongolia', '🇲🇳'),
('MO', 'Macao', '🇲🇴'), ('MP', 'Northern Mariana Islands', '🇲🇵'), ('MQ', 'Martinique', '🇲🇶'),
('MR', 'Mauritania', '🇲🇷'), ('MS', 'Montserrat', '🇲🇸'), ('MT', 'Malta', '🇲🇹'),
('MU', 'Mauritius', '🇲🇺'), ('MV', 'Maldives', '🇲🇻'), ('MW', 'Malawi', '🇲🇼'),
('MX', 'Mexico', '🇲🇽'), ('MY', 'Malaysia', '🇲🇾'), ('MZ', 'Mozambique', '🇲🇿'),
('NA', 'Namibia', '🇳🇦'), ('NC', 'New Caledonia', '🇳🇨'), ('NE', 'Niger', '🇳🇪'),
('NF', 'Norfolk Island', '🇳🇫'), ('NG', 'Nigeria', '🇳🇬'), ('NI', 'Nicaragua', '🇳🇮'),
('NL', 'Netherlands', '🇳🇱'), ('NO', 'Norway', '🇳🇴'), ('NP', 'Nepal', '🇳🇵'),
('NR', 'Nauru', '🇳🇷'), ('NU', 'Niue', '🇳🇺'), ('NZ', 'New Zealand', '🇳🇿'),
('OM', 'Oman', '🇴🇲'), ('PA', 'Panama', '🇵🇦'), ('PE', 'Peru', '🇵🇪'),
('PF', 'French Polynesia', '🇵🇫'), ('PG', 'Papua New Guinea', '🇵🇬'), ('PH', 'Philippines', '🇵🇭'),
('PK', 'Pakistan', '🇵🇰'), ('PL', 'Poland', '🇵🇱'), ('PM', 'Saint Pierre and Miquelon', '🇵🇲'),
('PN', 'Pitcairn', '🇵🇳'), ('PR', 'Puerto Rico', '🇵🇷'), ('PS', 'Palestine, State of', '🇵🇸'),
('PT', 'Portugal', '🇵🇹'), ('PW', 'Palau', '🇵🇼'), ('PY', 'Paraguay', '🇵🇾'),
('QA', 'Qatar', '🇶🇦'), ('RE', 'Réunion', '🇷🇪'), ('RO', 'Romania', '🇷🇴'),
('RS', 'Serbia', '🇷🇸'), ('RU', 'Russian Federation', '🇷🇺'), ('RW', 'Rwanda', '🇷🇼'),
('SA', 'Saudi Arabia', '🇸🇦'), ('SB', 'Solomon Islands', '🇸🇧'), ('SC', 'Seychelles', '🇸🇨'),
('SD', 'Sudan', '🇸🇩'), ('SE', 'Sweden', '🇸🇪'), ('SG', 'Singapore', '🇸🇬'),
('SH', 'Saint Helena, Ascension and Tristan da Cunha', '🇸🇭'), ('SI', 'Slovenia', '🇸🇮'), ('SJ', 'Svalbard and Jan Mayen', '🇸🇯'),
('SK', 'Slovakia', '🇸🇰'), ('SL', 'Sierra Leone', '🇸🇱'), ('SM', 'San Marino', '🇸🇲'),
('SN', 'Senegal', '🇸🇳'), ('SO', 'Somalia', '🇸🇴'), ('SR', 'Suriname', '🇸🇷'),
('SS', 'South Sudan', '🇸🇸'), ('ST', 'Sao Tome and Principe', '🇸🇹'), ('SV', 'El Salvador', '🇸🇻'),
('SX', 'Sint Maarten (Dutch part)', '🇸🇽'), ('SY', 'Syrian Arab Republic', '🇸🇾'), ('SZ', 'Eswatini', '🇸🇿'),
('TC', 'Turks and Caicos Islands', '🇹🇨'), ('TD', 'Chad', '🇹🇩'), ('TF', 'French Southern Territories', '🇹🇫'),
('TG', 'Togo', '🇹🇬'), ('TH', 'Thailand', '🇹🇭'), ('TJ', 'Tajikistan', '🇹🇯'),
('TK', 'Tokelau', '🇹🇰'), ('TL', 'Timor-Leste', '🇹🇱'), ('TM', 'Turkmenistan', '🇹🇲'),
('TN', 'Tunisia', '🇹🇳'), ('TO', 'Tonga', '🇹🇴'), ('TR', 'Turkey', '🇹🇷'),
('TT', 'Trinidad and Tobago', '🇹🇹'), ('TV', 'Tuvalu', '🇹🇻'), ('TW', 'Taiwan', '🇹🇼'),
('TZ', 'Tanzania, United Republic of', '🇹🇿'), ('UA', 'Ukraine', '🇺🇦'), ('UG', 'Uganda', '🇺🇬'),
('UM', 'United States Minor Outlying Islands', '🇺🇲'), ('US', 'United States of America', '🇺🇸'), ('UY', 'Uruguay', '🇺🇾'),
('UZ', 'Uzbekistan', '🇺🇿'), ('VA', 'Holy See', '🇻🇦'), ('VC', 'Saint Vincent and the Grenadines', '🇻🇨'),
('VE', 'Venezuela', '🇻🇪'), ('VG', 'Virgin Islands (British)', '🇻🇬'), ('VI', 'Virgin Islands (U.S.)', '🇻🇮'),
('VN', 'Viet Nam', '🇻🇳'), ('VU', 'Vanuatu', '🇻🇺'), ('WF', 'Wallis and Futuna', '🇼🇫'),
('WS', 'Samoa', '🇼🇸'), ('YE', 'Yemen', '🇾🇪'), ('YT', 'Mayotte', '🇾🇹'),
('ZA', 'South Africa', '🇿🇦'), ('ZM', 'Zambia', '🇿🇲'), ('ZW', 'Zimbabwe', '🇿🇼');
`;

async function handleConnectionError(error: any, connection: any) {
    if (connection) {
        await connection.end();
    }

    if (error.code === 'ECONNREFUSED') {
        throw new Error("A conexão com o banco de dados foi recusada. Verifique se o servidor de banco de dados está em execução e se o host e a porta estão corretos.");
    }
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
         throw new Error("Acesso negado ao banco de dados. Verifique o usuário e a senha.");
    }
     if (error.code === 'ER_BAD_DB_ERROR') {
         throw new Error(`O banco de dados especificado não foi encontrado. Por favor, crie-o ou verifique o nome.`);
    }

    throw new Error(error.message || "Ocorreu um erro desconhecido durante a operação do banco de dados.");
}

export async function saveDbCredentialsAction(data: unknown) {
    const validation = dbCredentialsSchema.safeParse(data);
    if (!validation.success) {
        throw new Error(validation.error.errors.map(e => e.message).join(', '));
    }
    const credentials = validation.data;

    const envPath = path.resolve(process.cwd(), '.env');
    let envContent = '';
    try {
        envContent = await fs.readFile(envPath, 'utf-8');
    } catch (e) {
        // .env file might not exist, which is fine
    }

    const lines = envContent.split('\n');
    const dbKeys = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
    
    // Filter out old DB keys and empty lines
    let newLines = lines.filter(line => {
        const trimmedLine = line.trim();
        if (trimmedLine === '') return false;
        return !dbKeys.some(key => trimmedLine.startsWith(key + '='));
    });

    // Add new DB keys from credentials
    newLines.push(`DB_HOST=${credentials.host}`);
    newLines.push(`DB_PORT=${credentials.port}`);
    newLines.push(`DB_USER=${credentials.user}`);
    newLines.push(`DB_PASSWORD=${credentials.password || ''}`);
    newLines.push(`DB_NAME=${credentials.database}`);

    try {
        await fs.writeFile(envPath, newLines.join('\n'));
        return { success: true, message: 'Credenciais salvas com sucesso no arquivo .env!' };
    } catch (error: any) {
        console.error("Falha ao salvar o arquivo .env:", error);
        throw new Error("Não foi possível salvar as credenciais. Verifique as permissões do servidor.");
    }
}


export async function testDbConnectionAction(data: unknown) {
    const validation = dbCredentialsSchema.safeParse(data);
    if (!validation.success) {
        throw new Error(validation.error.errors.map(e => e.message).join(', '));
    }
    const credentials = validation.data;
    
    let connection;
    try {
        connection = await getDbConnection(credentials);
        await connection.ping();
        await connection.end();
        return {
            success: true,
            message: "Conexão com o banco de dados bem-sucedida!",
        };
    } catch (error: any) {
        console.error("Falha no teste de conexão com o banco de dados:", error);
        await handleConnectionError(error, connection);
        // Fallback return (should not be reached if handleConnectionError throws)
        return { success: false, message: error.message };
    }
}


export async function installDatabaseAction(data: unknown) {
    const validation = dbCredentialsSchema.safeParse(data);
    if (!validation.success) {
        throw new Error(validation.error.errors.map(e => e.message).join(', '));
    }
    const credentials = validation.data;

    let connection;
    try {
        connection = await getDbConnection(credentials);
        
        // Execute all table creation queries
        await connection.query(createUsersTableQuery);
        await connection.query(createProjectsTableQuery);
        await connection.query(createSettingsTableQuery);
        await connection.query(createSubscriptionsTableQuery);
        await connection.query(createFunnelStepsTableQuery);
        await connection.query(createCloakerRulesTableQuery);
        await connection.query(createSecurityLogsTableQuery);
        await connection.query(createNotificationsTableQuery);
        await connection.query(createProjectSettingsTableQuery);
        await connection.query(createAnalyticsVisitsTableQuery);
        await connection.query(createCountriesTableQuery);
        await connection.query(insertCountriesDataQuery);

        await connection.end();
        
        return {
            success: true,
            message: "Banco de dados e todas as tabelas foram instalados com sucesso!",
        };
    } catch (error: any) {
        console.error("Falha na instalação do banco de dados:", error);
        await handleConnectionError(error, connection);
        // Fallback return (should not be reached if handleConnectionError throws)
        return { success: false, message: error.message };
    }
}
