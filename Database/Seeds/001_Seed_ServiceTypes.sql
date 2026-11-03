

-- Inserting default values into the service types table
INSERT INTO ServiceTypes (
    ServiceTypeName,
    Category,
    DefaultIntervalMiles,
    DefaultIntervalMonths,
    Description,
    CreatedDate,
    ModifyDate,
    LogicalCancel
)
VALUES
-- ENGINE MAINTENANCE
('Engine Oil Change', 'Engine', 5000, 6,
 'Replace engine oil and oil filter', CURRENT_TIMESTAMP, NULL, 0),

('Engine Air Filter', 'Engine', 15000, 12,
 'Inspect or replace engine air filter', CURRENT_TIMESTAMP, NULL, 0),

('Spark Plug Replacement', 'Engine', 100000, NULL,
 'Replace engine spark plugs', CURRENT_TIMESTAMP, NULL, 0),

('Engine Coolant Flush', 'Engine', NULL, 60,
 'Replace engine cooling system fluid', CURRENT_TIMESTAMP, NULL, 0),

('Serpentine Belt Replacement', 'Engine', NULL, NULL,
 'Inspect or replace engine drive belt', CURRENT_TIMESTAMP, NULL, 0),

-- TRANSMISSION & DRIVETRAIN
('Transmission Fluid Change', 'Drivetrain', 60000, NULL,
 'Replace automatic or manual transmission fluid', CURRENT_TIMESTAMP, NULL, 0),

('CVT Fluid Change', 'Drivetrain', 30000, NULL,
 'Replace continuously variable transmission fluid', CURRENT_TIMESTAMP, NULL, 0),

('Rear Differential Fluid Change', 'Drivetrain', 30000, NULL,
 'Replace rear differential gear oil', CURRENT_TIMESTAMP, NULL, 0),

('Front Differential Fluid Change', 'Drivetrain', 30000, NULL,
 'Replace front differential gear oil', CURRENT_TIMESTAMP, NULL, 0),

('Transfer Case Fluid Change', 'Drivetrain', 30000, NULL,
 'Replace transfer case fluid', CURRENT_TIMESTAMP, NULL, 0),

-- BRAKES
('Brake Pad Replacement', 'Brakes', NULL, NULL,
 'Replace worn brake pads', CURRENT_TIMESTAMP, NULL, 0),

('Brake Rotor Replacement', 'Brakes', NULL, NULL,
 'Replace worn brake rotors', CURRENT_TIMESTAMP, NULL, 0),

('Brake Fluid Replacement', 'Brakes', NULL, 36,
 'Replace brake hydraulic fluid', CURRENT_TIMESTAMP, NULL, 0),

('Brake Inspection', 'Brakes', 10000, 12,
 'Inspect brake pads, rotors and components', CURRENT_TIMESTAMP, NULL, 0),

-- TIRES
('Tire Rotation', 'Tires', 5000, 6,
 'Rotate tires according to drivetrain requirements', CURRENT_TIMESTAMP, NULL, 0),

('Wheel Alignment', 'Tires', NULL, NULL,
 'Check and adjust wheel alignment', CURRENT_TIMESTAMP, NULL, 0),

('Tire Replacement', 'Tires', NULL, NULL,
 'Replace worn or damaged tires', CURRENT_TIMESTAMP, NULL, 0),

('Wheel Balancing', 'Tires', NULL, NULL,
 'Balance wheel and tire assemblies', CURRENT_TIMESTAMP, NULL, 0),

-- ELECTRICAL
('Battery Replacement', 'Electrical', NULL, NULL,
 'Replace vehicle battery', CURRENT_TIMESTAMP, NULL, 0),

('Battery Inspection', 'Electrical', NULL, 12,
 'Test battery condition and charging system', CURRENT_TIMESTAMP, NULL, 0),

-- CABIN & FILTERS
('Cabin Air Filter', 'Filters', 15000, 12,
 'Replace cabin air filtration element', CURRENT_TIMESTAMP, NULL, 0),

('Windshield Wiper Replacement', 'Exterior', NULL, 12,
 'Replace windshield wiper blades', CURRENT_TIMESTAMP, NULL, 0),

-- INSPECTIONS
('Annual Vehicle Inspection', 'Inspection', NULL, 12,
 'Perform annual vehicle safety inspection', CURRENT_TIMESTAMP, NULL, 0),

('Suspension Inspection', 'Inspection', NULL, 12,
 'Inspect shocks, struts, bushings and steering components', CURRENT_TIMESTAMP, NULL, 0),

-- GENERAL
('Other Maintenance', 'Other', NULL, NULL,
 'Custom maintenance or repair service', CURRENT_TIMESTAMP, NULL, 0);

