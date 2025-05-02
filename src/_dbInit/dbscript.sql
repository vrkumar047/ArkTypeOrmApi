--******************************************************** Master Database
-------------------------- Client Type
INSERT INTO client_types(type_name, is_active, created_at, created_by, updated_at, updated_by)
	VALUES ('Residental', 1, now(), 'system', now(), 'system');
INSERT INTO client_types(type_name, is_active, created_at, created_by, updated_at, updated_by)
	VALUES ('Institutional', 1, now(), 'system', now(), 'system');
INSERT INTO client_types(type_name, is_active, created_at, created_by, updated_at, updated_by)
	VALUES ('Commercial', 1, now(), 'system', now(), 'system');

-------------------------------------------------------- Functions
CREATE OR REPLACE FUNCTION f_get_clients(
	)
    RETURNS TABLE("clientId" character varying, "clientName" character varying, "clientType" integer, "clientTypeName" character varying, contact character varying, "contactPerson" character varying, "emailId" character varying, "startDate" character varying, "endDate" character varying, "companyConfig" jsonb, location character varying, address character varying, "noOfResidenceUnit" integer, "noOfResidentialUnit" integer, "noOfNonResidentialUnit" integer, "noOfFourWheelerParking" integer, "noOfTwoWheelerParking" integer, "clientLogo" character varying, "isBlocked" integer) 
    LANGUAGE 'plpgsql'
AS $BODY$
begin
				return query 
				select cl.client_id, cl.client_name, cl.client_type, clt.type_name client_type_name, cl.contact, cl.contact_person,
				cl.email_id, to_char(cl.start_date, 'DD-Mon-YYYY')::varchar start_date, to_char(cl.end_date, 'DD-Mon-YYYY')::varchar
				end_date, cl.client_config, cl.location, cl.address, cl.no_of_residence_unit, cl.no_of_residential_unit, cl.no_of_non_residential_unit,
				cl.no_of_four_wheeler_parking, cl.no_of_two_wheeler_parking, cl.client_logo, cl.is_blocked
				from clients cl inner join client_types clt
				on cl.client_type = clt.type_id
				where cl.is_active = 1;
end;
$BODY$;	


--******************************************************** Company Database
------------------------------------ Type
CREATE TYPE role_modules_permissions AS
(
	"roleId" integer,
	"moduleId" integer,
	"create" integer,
	"read" integer,
	"update" integer,
	"delete" integer,
	"download" integer
);

CREATE TYPE group_modules_permissions AS
(
	"groupId" integer,
	"moduleId" integer,
	"create" integer,
	"read" integer,
	"update" integer,
	"delete" integer,
	"download" integer
);

-------------------------- Device Type
INSERT INTO device_type(type_name, is_active, created_at, created_by, updated_at, updated_by)
	VALUES ('zEYE Controller', 1, now(), 'admin', now(), 'admin');
INSERT INTO device_type(type_name, is_active, created_at, created_by, updated_at, updated_by)
	VALUES ('XSMatics Controller', 1, now(), 'admin', now(), 'admin');
INSERT INTO device_type(type_name, is_active, created_at, created_by, updated_at, updated_by)
	VALUES ('Printer', 1, now(), 'admin', now(), 'admin');
INSERT INTO device_type(type_name, is_active, created_at, created_by, updated_at, updated_by)
	VALUES ('PC', 1, now(), 'admin', now(), 'admin');
INSERT INTO device_type(type_name, is_active, created_at, created_by, updated_at, updated_by)
	VALUES ('HF RFID with GPS', 1, now(), 'admin', now(), 'admin');
INSERT INTO device_type(type_name, is_active, created_at, created_by, updated_at, updated_by)
	VALUES ('Handhled Device', 1, now(), 'admin', now(), 'admin');
INSERT INTO device_type(type_name, is_active, created_at, created_by, updated_at, updated_by)
	VALUES ('Vehicle Camera', 1, now(), 'admin', now(), 'admin');
INSERT INTO device_type(type_name, is_active, created_at, created_by, updated_at, updated_by)
	VALUES ('Attendance Logger', 1, now(), 'admin', now(), 'admin');	
-------------------------- Residence category Type
INSERT INTO residence_category( category_name, is_active, created_at, created_by, updated_at, updated_by)
	VALUES ( 'Golf Club Member', 1, now(), 'admin', now(), 'admin');
INSERT INTO residence_category( category_name, is_active, created_at, created_by, updated_at, updated_by)
	VALUES ( 'FM Officials', 1, now(), 'admin', now(), 'admin');
INSERT INTO residence_category( category_name, is_active, created_at, created_by, updated_at, updated_by)
	VALUES ( 'Resident Member', 1, now(), 'admin', now(), 'admin');
INSERT INTO residence_category( category_name, is_active, created_at, created_by, updated_at, updated_by)
	VALUES ( 'Commercial', 1, now(), 'admin', now(), 'admin');
INSERT INTO residence_category( category_name, is_active, created_at, created_by, updated_at, updated_by)
	VALUES ( 'SPA - 6th Sense', 1, now(), 'admin', now(), 'admin');
INSERT INTO residence_category( category_name, is_active, created_at, created_by, updated_at, updated_by)
	VALUES ( 'SDF Flat', 1, now(), 'admin', now(), 'admin');

-------------------------- Visit Purpose Type
insert into visit_purposes(purpose,is_active,created_at,created_by,updated_at,updated_by) values('Club',1,now(),'admin',now(),'admin');
insert into visit_purposes(purpose,is_active,created_at,created_by,updated_at,updated_by) values('Mother Diary',1,now(),'admin',now(),'admin');
insert into visit_purposes(purpose,is_active,created_at,created_by,updated_at,updated_by) values('Bank',1,now(),'admin',now(),'admin');
insert into visit_purposes(purpose,is_active,created_at,created_by,updated_at,updated_by) values('Food Delivery',1,now(),'admin',now(),'admin');
insert into visit_purposes(purpose,is_active,created_at,created_by,updated_at,updated_by) values('Courier/Parcel',1,now(),'admin',now(),'admin');
insert into visit_purposes(purpose,is_active,created_at,created_by,updated_at,updated_by) values('Service',1,now(),'admin',now(),'admin');
insert into visit_purposes(purpose,is_active,created_at,created_by,updated_at,updated_by) values('Visitor General',1,now(),'admin',now(),'admin');
insert into visit_purposes(purpose,is_active,created_at,created_by,updated_at,updated_by) values('Rikshaw/Rapido',1,now(),'admin',now(),'admin');
insert into visit_purposes(purpose,is_active,created_at,created_by,updated_at,updated_by) values('Multi Story Flats',1,now(),'admin',now(),'admin');

-------------------------- module	
INSERT INTO modules(parent_module_id, module_name, is_parent, title, path, icon, "create", read, update, delete, download, selected, active, is_active, created_at, created_by, updated_at, updated_by)
	VALUES (null, 'Dashboard', 0, 'Dashboard', '/dashboard', 'fa fa-home sidemenu_icon', 0, 0, 0, 0, 0, true, true,1,now() , 'admin', now(),'admin');
INSERT INTO modules(parent_module_id, module_name, is_parent, title, path, icon, "create", read, update, delete, download, selected, active, is_active, created_at, created_by, updated_at, updated_by)
	VALUES (null, 'Vehicles', 0, 'Vehicles', '/vehicle/vehicles', 'fa fa-car sidemenu_icon', 0, 0, 0, 0, 0, false, false,1,now() , 'admin', now(),'admin');
INSERT INTO modules(parent_module_id, module_name, is_parent, title, path, icon, "create", read, update, delete, download, selected, active, is_active, created_at, created_by, updated_at, updated_by)
	VALUES (null, 'Societies', 0, 'Societies', '/society/societies', 'fa fa-building-o sidemenu_icon', 0, 0, 0, 0, 0, false, false,1,now() , 'admin', now(),'admin');
INSERT INTO modules(parent_module_id, module_name, is_parent, title, path, icon, "create", read, update, delete, download, selected, active, is_active, created_at, created_by, updated_at, updated_by)
	VALUES (null, 'Staffs', 0, 'Staffs', '/staff/staffs', 'fa fa-users sidemenu_icon', 0, 0, 0, 0, 0, false, false,1,now() , 'admin', now(),'admin');
INSERT INTO modules(parent_module_id, module_name, is_parent, title, path, icon, "create", read, update, delete, download, selected, active, is_active, created_at, created_by, updated_at, updated_by)
	VALUES (null, 'Gates', 0, 'Gates', '/gate/gates', 'fa fa-university sidemenu_icon', 0, 0, 0, 0, 0, false, false,1,now() , 'admin', now(),'admin');
INSERT INTO modules(parent_module_id, module_name, is_parent, title, path, icon, "create", read, update, delete, download, selected, active, is_active, created_at, created_by, updated_at, updated_by)
	VALUES (null, 'Devices', 0, 'Devices', '/device/devices', 'fa fa-laptop sidemenu_icon', 0, 0, 0, 0, 0, false, false,1,now() , 'admin', now(),'admin');
INSERT INTO modules(parent_module_id, module_name, is_parent, title, path, icon, "create", read, update, delete, download, selected, active, is_active, created_at, created_by, updated_at, updated_by)
	VALUES (null, 'Properties', 0, 'Properties', '/property/propertie', 'fa fa-building-o sidemenu_icon', 0, 0, 0, 0, 0, false, false,1,now() , 'admin', now(),'admin');
INSERT INTO modules(parent_module_id, module_name, is_parent, title, path, icon, "create", read, update, delete, download, selected, active, is_active, created_at, created_by, updated_at, updated_by)
	VALUES (null, 'Reports', 1, 'Reports', '', 'fa fa-file-o sidemenu_icon', 0, 0, 0, 0, 0, false, false,1,now() , 'admin', now(),'admin');
INSERT INTO modules(parent_module_id, module_name, is_parent, title, path, icon, "create", read, update, delete, download, selected, active, is_active, created_at, created_by, updated_at, updated_by)
	VALUES (8, 'Tag Lane', 0, 'Tag Lane', '', '', 0, 0, 0, 0, 0, false, false,1,now() , 'admin', now(),'admin');
INSERT INTO modules(parent_module_id, module_name, is_parent, title, path, icon, "create", read, update, delete, download, selected, active, is_active, created_at, created_by, updated_at, updated_by)
	VALUES (8, 'Visitor Lane', 0, 'Visitor Lane', '', '', 0, 0, 0, 0, 0, false, false,1,now() , 'admin', now(),'admin');
INSERT INTO modules(parent_module_id, module_name, is_parent, title, path, icon, "create", read, update, delete, download, selected, active, is_active, created_at, created_by, updated_at, updated_by)
	VALUES (8, 'Commercial Lane', 0, 'Commercial Lane', '', '', 0, 0, 0, 0, 0, false, false,1,now() , 'admin', now(),'admin');
INSERT INTO modules(parent_module_id, module_name, is_parent, title, path, icon, "create", read, update, delete, download, selected, active, is_active, created_at, created_by, updated_at, updated_by)
	VALUES (8, 'Domestic Lane', 0, 'Domestic Lane', '', '', 0, 0, 0, 0, 0, false, false,1,now() , 'admin', now(),'admin');
INSERT INTO modules(parent_module_id, module_name, is_parent, title, path, icon, "create", read, update, delete, download, selected, active, is_active, created_at, created_by, updated_at, updated_by)
	VALUES (null, 'Admin', 1, 'Admin', '', '', 0, 0, 0, 0, 0, false, false,1,now() , 'admin', now(),'admin');
INSERT INTO modules(parent_module_id, module_name, is_parent, title, path, icon, "create", read, update, delete, download, selected, active, is_active, created_at, created_by, updated_at, updated_by)
	VALUES (13, 'Users', 0, 'Users', '/user/users', 'fa fa-user-secret sidemenu_icon', 0, 0, 0, 0, 0, false, false,1,now() , 'admin', now(),'admin');
INSERT INTO modules(parent_module_id, module_name, is_parent, title, path, icon, "create", read, update, delete, download, selected, active, is_active, created_at, created_by, updated_at, updated_by)
	VALUES (13, 'User Permissions', 0, 'User Permissions', '/user/userpermissions', 'fa fa-lock sidemenu_icon', 0, 0, 0, 0, 0, false, false,1,now() , 'admin', now(),'admin');
INSERT INTO modules(parent_module_id, module_name, is_parent, title, path, icon, "create", read, update, delete, download, selected, active, is_active, created_at, created_by, updated_at, updated_by)
	VALUES (13, 'Roles', 0, 'Roles', '/role/roles', 'fa fa-lock sidemenu_icon', 0, 0, 0, 0, 0, false, false,1,now() , 'admin', now(),'admin');
INSERT INTO modules(parent_module_id, module_name, is_parent, title, path, icon, "create", read, update, delete, download, selected, active, is_active, created_at, created_by, updated_at, updated_by)
	VALUES (13, 'Groups', 0, 'Groups', '/group/groups', 'fa fa-lock sidemenu_icon', 0, 0, 0, 0, 0, false, false,1,now() , 'admin', now(),'admin');
INSERT INTO modules(parent_module_id, module_name, is_parent, title, path, icon, "create", read, update, delete, download, selected, active, is_active, created_at, created_by, updated_at, updated_by)
	VALUES (13, 'Modules', 0, 'Modules', '/module/modules', 'fa fa-lock sidemenu_icon', 0, 0, 0, 0, 0, false, false,1,now() , 'admin', now(),'admin');	
-------------------------------------role module Permissions
INSERT INTO role_module_permissions(role_id, module_id, "create", read, update, delete, download, is_active, created_at, created_by, updated_at, updated_by)
	VALUES (1, 1, 1, 1, 1, 1, 1, 1, now(), 'admin', now(), 'admin');
INSERT INTO role_module_permissions(role_id, module_id, "create", read, update, delete, download, is_active, created_at, created_by, updated_at, updated_by)
	VALUES (1, 2, 1, 1, 1, 1, 1, 1, now(), 'admin', now(), 'admin');
INSERT INTO role_module_permissions(role_id, module_id, "create", read, update, delete, download, is_active, created_at, created_by, updated_at, updated_by)
	VALUES (1, 3, 1, 1, 1, 1, 1, 1, now(), 'admin', now(), 'admin');
INSERT INTO role_module_permissions(role_id, module_id, "create", read, update, delete, download, is_active, created_at, created_by, updated_at, updated_by)
	VALUES (1, 4, 1, 1, 1, 1, 1, 1, now(), 'admin', now(), 'admin');
INSERT INTO role_module_permissions(role_id, module_id, "create", read, update, delete, download, is_active, created_at, created_by, updated_at, updated_by)
	VALUES (1, 5, 1, 1, 1, 1, 1, 1, now(), 'admin', now(), 'admin');
INSERT INTO role_module_permissions(role_id, module_id, "create", read, update, delete, download, is_active, created_at, created_by, updated_at, updated_by)
	VALUES (1, 6, 1, 1, 1, 1, 1, 1, now(), 'admin', now(), 'admin');
INSERT INTO role_module_permissions(role_id, module_id, "create", read, update, delete, download, is_active, created_at, created_by, updated_at, updated_by)
	VALUES (1, 7, 1, 1, 1, 1, 1, 1, now(), 'admin', now(), 'admin');
INSERT INTO role_module_permissions(role_id, module_id, "create", read, update, delete, download, is_active, created_at, created_by, updated_at, updated_by)
	VALUES (1, 9, 1, 1, 1, 1, 1, 1, now(), 'admin', now(), 'admin');
INSERT INTO role_module_permissions(role_id, module_id, "create", read, update, delete, download, is_active, created_at, created_by, updated_at, updated_by)
	VALUES (1, 10, 1, 1, 1, 1, 1, 1, now(), 'admin', now(), 'admin');
INSERT INTO role_module_permissions(role_id, module_id, "create", read, update, delete, download, is_active, created_at, created_by, updated_at, updated_by)
	VALUES (1, 11, 0, 0, 0, 0, 0, 1, now(), 'admin', now(), 'admin');
INSERT INTO role_module_permissions(role_id, module_id, "create", read, update, delete, download, is_active, created_at, created_by, updated_at, updated_by)
	VALUES (1, 12, 1, 1, 1, 1, 1, 1, now(), 'admin', now(), 'admin');
INSERT INTO role_module_permissions(role_id, module_id, "create", read, update, delete, download, is_active, created_at, created_by, updated_at, updated_by)
	VALUES (1, 14, 1, 1, 1, 1, 1, 1, now(), 'admin', now(), 'admin');
INSERT INTO role_module_permissions(role_id, module_id, "create", read, update, delete, download, is_active, created_at, created_by, updated_at, updated_by)
	VALUES (1, 15, 1, 1, 1, 1, 1, 1, now(), 'admin', now(), 'admin');
INSERT INTO role_module_permissions(role_id, module_id, "create", read, update, delete, download, is_active, created_at, created_by, updated_at, updated_by)
	VALUES (1, 16, 1, 1, 1, 1, 1, 1, now(), 'admin', now(), 'admin');
INSERT INTO role_module_permissions(role_id, module_id, "create", read, update, delete, download, is_active, created_at, created_by, updated_at, updated_by)
	VALUES (1, 17, 1, 1, 1, 1, 1, 1, now(), 'admin', now(), 'admin');
INSERT INTO role_module_permissions(role_id, module_id, "create", read, update, delete, download, is_active, created_at, created_by, updated_at, updated_by)
	VALUES (1, 18, 1, 1, 1, 1, 1, 1, now(), 'admin', now(), 'admin');	

-------------------------------------country
INSERT INTO countries(country_code, country_name, is_active, created_at, created_by, updated_at, updated_by)
	VALUES ('IN', 'India', 1, now(), 'system', now(), 'system');	

-------------------------------------state
INSERT INTO states(country_code, state_name, state_code, is_active, created_at, created_by, updated_at, updated_by) VALUES ( 'IN',  'Andaman and Nicobar', 'AN', 1, now(), 'system', now(), 'system');
INSERT INTO states(country_code, state_name, state_code, is_active, created_at, created_by, updated_at, updated_by) VALUES ( 'IN',  'Andhra Pradesh', 'AP', 1, now(), 'system', now(), 'system');
INSERT INTO states(country_code, state_name, state_code, is_active, created_at, created_by, updated_at, updated_by) VALUES ( 'IN',  'Arunachal Pradesh', 'AR', 1, now(), 'system', now(), 'system');
INSERT INTO states(country_code, state_name, state_code, is_active, created_at, created_by, updated_at, updated_by) VALUES ( 'IN',  'Assam', 'AS', 1, now(), 'system', now(), 'system');
INSERT INTO states(country_code, state_name, state_code, is_active, created_at, created_by, updated_at, updated_by) VALUES ( 'IN',  'Bihar', 'BR', 1, now(), 'system', now(), 'system');
INSERT INTO states(country_code, state_name, state_code, is_active, created_at, created_by, updated_at, updated_by) VALUES ( 'IN',  'Chandigarh', 'CH', 1, now(), 'system', now(), 'system');
INSERT INTO states(country_code, state_name, state_code, is_active, created_at, created_by, updated_at, updated_by) VALUES (  'IN', 'Chhattisgarh', 'CT', 1, now(), 'system', now(), 'system');
INSERT INTO states(country_code, state_name, state_code, is_active, created_at, created_by, updated_at, updated_by) VALUES ( 'IN',  'Dadra and Nagar Haveli', 'DN', 1, now(), 'system', now(), 'system');
INSERT INTO states(country_code, state_name, state_code, is_active, created_at, created_by, updated_at, updated_by) VALUES ( 'IN',  'Daman and Diu', 'DD', 1, now(), 'system', now(), 'system');
INSERT INTO states(country_code, state_name, state_code, is_active, created_at, created_by, updated_at, updated_by) VALUES ( 'IN',  'Delhi', 'DL', 1, now(), 'system', now(), 'system');
INSERT INTO states(country_code, state_name, state_code, is_active, created_at, created_by, updated_at, updated_by) VALUES ( 'IN',  'Goa', 'GA', 1, now(), 'system', now(), 'system');
INSERT INTO states(country_code, state_name, state_code, is_active, created_at, created_by, updated_at, updated_by) VALUES ( 'IN',  'Gujarat', 'GJ', 1, now(), 'system', now(), 'system');
INSERT INTO states(country_code, state_name, state_code, is_active, created_at, created_by, updated_at, updated_by) VALUES ( 'IN',  'Haryana', 'HR', 1, now(), 'system', now(), 'system');
INSERT INTO states(country_code, state_name, state_code, is_active, created_at, created_by, updated_at, updated_by) VALUES ( 'IN',  'Himachal Pradesh', 'HP', 1, now(), 'system', now(), 'system');
INSERT INTO states(country_code, state_name, state_code, is_active, created_at, created_by, updated_at, updated_by) VALUES ( 'IN',  'Jammu and Kashmir', 'JK', 1, now(), 'system', now(), 'system');
INSERT INTO states(country_code, state_name, state_code, is_active, created_at, created_by, updated_at, updated_by) VALUES ( 'IN',  'Jharkhand', 'JH', 1, now(), 'system', now(), 'system');
INSERT INTO states(country_code, state_name, state_code, is_active, created_at, created_by, updated_at, updated_by) VALUES ( 'IN',  'Karnataka', 'KA', 1, now(), 'system', now(), 'system');
INSERT INTO states(country_code, state_name, state_code, is_active, created_at, created_by, updated_at, updated_by) VALUES ( 'IN', 'Kerala', 'KL', 1, now(), 'system', now(), 'system');
INSERT INTO states(country_code, state_name, state_code, is_active, created_at, created_by, updated_at, updated_by) VALUES ( 'IN',  'Lakshadweep', 'LD', 1, now(), 'system', now(), 'system');
INSERT INTO states(country_code, state_name, state_code, is_active, created_at, created_by, updated_at, updated_by) VALUES ( 'IN', 'Madhya Pradesh', 'MP', 1, now(), 'system', now(), 'system');
INSERT INTO states(country_code, state_name, state_code, is_active, created_at, created_by, updated_at, updated_by) VALUES ( 'IN', 'Maharashtra', 'MH', 1, now(), 'system', now(), 'system');
INSERT INTO states(country_code, state_name, state_code, is_active, created_at, created_by, updated_at, updated_by) VALUES ( 'IN', 'Manipur', 'MN', 1, now(), 'system', now(), 'system');
INSERT INTO states(country_code, state_name, state_code, is_active, created_at, created_by, updated_at, updated_by) VALUES ( 'IN', 'Meghalaya', 'ML', 1, now(), 'system', now(), 'system');
INSERT INTO states(country_code, state_name, state_code, is_active, created_at, created_by, updated_at, updated_by) VALUES ( 'IN', 'Mizoram', 'MZ', 1, now(), 'system', now(), 'system');
INSERT INTO states(country_code, state_name, state_code, is_active, created_at, created_by, updated_at, updated_by) VALUES ( 'IN', 'Nagaland', 'NL', 1, now(), 'system', now(), 'system');
INSERT INTO states(country_code, state_name, state_code, is_active, created_at, created_by, updated_at, updated_by) VALUES ( 'IN', 'Odisha', 'OR', 1, now(), 'system', now(), 'system');
INSERT INTO states(country_code, state_name, state_code, is_active, created_at, created_by, updated_at, updated_by) VALUES ( 'IN', 'Puducherry', 'PY', 1, now(), 'system', now(), 'system');
INSERT INTO states(country_code, state_name, state_code, is_active, created_at, created_by, updated_at, updated_by) VALUES ( 'IN', 'Punjab', 'PB', 1, now(), 'system', now(), 'system');
INSERT INTO states(country_code, state_name, state_code, is_active, created_at, created_by, updated_at, updated_by) VALUES ( 'IN', 'Rajasthan', 'RJ', 1, now(), 'system', now(), 'system');
INSERT INTO states(country_code, state_name, state_code, is_active, created_at, created_by, updated_at, updated_by) VALUES ( 'IN', 'Sikkim', 'SK', 1, now(), 'system', now(), 'system');
INSERT INTO states(country_code, state_name, state_code, is_active, created_at, created_by, updated_at, updated_by) VALUES ( 'IN', 'Tamil Nadu', 'TN', 1, now(), 'system', now(), 'system');
INSERT INTO states(country_code, state_name, state_code, is_active, created_at, created_by, updated_at, updated_by) VALUES ( 'IN', 'Telangana', 'TG', 1, now(), 'system', now(), 'system');
INSERT INTO states(country_code, state_name, state_code, is_active, created_at, created_by, updated_at, updated_by) VALUES ( 'IN', 'Tripura', 'TR', 1, now(), 'system', now(), 'system');
INSERT INTO states(country_code, state_name, state_code, is_active, created_at, created_by, updated_at, updated_by) VALUES ( 'IN', 'Uttar Pradesh', 'UP', 1, now(), 'system', now(), 'system');
INSERT INTO states(country_code, state_name, state_code, is_active, created_at, created_by, updated_at, updated_by) VALUES ( 'IN', 'Uttarakhand', 'UT', 1, now(), 'system', now(), 'system');
INSERT INTO states(country_code, state_name, state_code, is_active, created_at, created_by, updated_at, updated_by) VALUES ( 'IN', 'West Bengal', 'WB', 1, now(), 'system', now(), 'system');
	
	
---------------------------------------------------------------Functions
CREATE OR REPLACE FUNCTION f_get_role_module_list(
	roleid integer)
    RETURNS TABLE("moduleId" integer, "moduleName" character varying, "roleId" integer, "moduleLevel" integer, "parentModuleId" integer, "parentModuleName" character varying, "isParent" integer, "create" integer, read integer, update integer, delete integer, download integer, title character varying, path character varying, icon character varying, selected boolean, active boolean) 
    LANGUAGE 'plpgsql'

AS $BODY$
begin	
		return query
		with recursive cteTbl (module_id, module_name, module_level, parent_module_id, parent_module_name, role_id,"create","read","update","delete",download ) AS (
				select md.module_id,  md.module_name , 1 module_level, 0 parent_module_id,  ''::varchar parent_module_name, coalesce(rm.role_id,roleid) role_id,rm.create,rm.read,rm.update,rm.delete,rm.download from modules md
				 left join
				(select rmp.role_id,rmp.module_id,rmp.create,rmp.read,rmp.update,rmp.delete,rmp.download from role_module_permissions rmp where rmp.role_id = roleid) rm
				on md.module_id = rm.module_id
				where md.parent_module_id is null and md.is_active = 1
			
			union all
				
								select md.module_id,  md.module_name, (ct.module_level + 1) module_level, ct.module_id parent_module_id,  cast(ct.module_name as varchar) parent_module_name, coalesce(rm.role_id,roleid) role_id,rm.create,rm.read,rm.update,rm.delete,rm.download from modules md
				 left join
				(select rmp.role_id,rmp.module_id,rmp.create,rmp.read,rmp.update,rmp.delete,rmp.download from role_module_permissions rmp where rmp.role_id = roleid) rm
				on md.module_id = rm.module_id
				 join cteTbl ct on md.parent_module_id = ct.module_id
				where  md.is_active = 1
			)
					  select tmp.module_id,tmp.module_name,tmp.role_id, tmp.module_level, tmp.parent_module_id, tmp.parent_module_name, md.is_parent, coalesce(tmp."create",0) "create", coalesce(tmp."read",0) "read", coalesce(tmp."update",0) "update", coalesce(tmp."delete",0) "delete", coalesce(tmp.download,0) download, md.title,
		  md.path, md.icon, md.selected, md.active from cteTbl tmp
		  join modules md
		  on tmp.module_id = md.module_id
		  where md.is_active = 1
		  order by tmp.module_id, tmp.module_level;
end;
$BODY$;

CREATE OR REPLACE FUNCTION f_get_group_module_list(
	groupid integer)
    RETURNS TABLE("moduleId" integer, "moduleName" character varying, "groupId" integer, "moduleLevel" integer, "parentModuleId" integer, "parentModuleName" character varying, "isParent" integer, "create" integer, read integer, update integer, delete integer, download integer, title character varying, path character varying, icon character varying, selected boolean, active boolean) 
    LANGUAGE 'plpgsql'

AS $BODY$
begin	
		return query
		with recursive cteTbl (module_id, module_name, module_level, parent_module_id, parent_module_name, group_id,"create","read","update","delete",download ) AS (
				select md.module_id,  md.module_name , 1 module_level, 0 parent_module_id,  ''::varchar parent_module_name, coalesce(gm.group_id,groupid) group_id,gm.create,gm.read,gm.update,gm.delete,gm.download from modules md
				 left join
				(select gmp.group_id,gmp.module_id,gmp.create,gmp.read,gmp.update,gmp.delete,gmp.download from group_module_permissions gmp where gmp.group_id = groupid) gm
				on md.module_id = gm.module_id
				where md.parent_module_id is null and md.is_active = 1
			
			union all
				
								select md.module_id,  md.module_name, (ct.module_level + 1) module_level, ct.module_id parent_module_id,  cast(ct.module_name as varchar) parent_module_name, coalesce(gm.group_id,groupid) group_id,gm.create,gm.read,gm.update,gm.delete,gm.download from modules md
				 left join
				(select gmp.group_id,gmp.module_id,gmp.create,gmp.read,gmp.update,gmp.delete,gmp.download from group_module_permissions gmp where gmp.group_id = groupid) gm
				on md.module_id = gm.module_id
				 join cteTbl ct on md.parent_module_id = ct.module_id
				where  md.is_active = 1
			)
					  select tmp.module_id,tmp.module_name,tmp.group_id, tmp.module_level, tmp.parent_module_id, tmp.parent_module_name, md.is_parent, coalesce(tmp."create",0) "create", coalesce(tmp."read",0) "read", coalesce(tmp."update",0) "update", coalesce(tmp."delete",0) "delete", coalesce(tmp.download,0) download, md.title,
		  md.path, md.icon, md.selected, md.active from cteTbl tmp
		  join modules md
		  on tmp.module_id = md.module_id
		  where md.is_active = 1
		  order by tmp.module_id, tmp.module_level;
end;
$BODY$;

----------------------------------------------------------- Functions
CREATE OR REPLACE FUNCTION f_add_update_role_permission(
	usrid character varying,
	permissions json)
    RETURNS TABLE("rolePermissionId" integer) 
    LANGUAGE 'plpgsql'

AS $BODY$
 declare temprow record;
begin

 		CREATE TEMP TABLE IF NOT EXISTS temp_table1 AS
        	 select * from json_populate_recordset(null::role_modules_permissions,permissions) tbl1;
			 
		CREATE TEMP TABLE IF NOT EXISTS temp_table2 AS
        	select * from temp_table1 t1 where t1."roleId" is not null and t1."moduleId" is not null;
			
			begin 
	        	for temprow in
			    	select * from temp_table2 tbl order by tbl."moduleId"
			   loop
				   if exists (select * from role_module_permissions tb where tb.role_id = temprow."roleId" and tb.module_id = temprow."moduleId") THEN
				     update role_module_permissions set 
					 "create" = temprow."create",
					 "read" = temprow."read",
					 "update" = temprow."update",
					 "delete" = temprow."delete",
					 "download" = temprow."download",
					 is_active = 1,
				     updated_by = usrid,
					 updated_at = now()
					 where role_id = temprow."roleId" and module_id = temprow."moduleId";
				   else
				   	 insert into role_module_permissions(role_id, module_id, "create", "read", "update", "delete", download, is_active, created_at, created_by, updated_at, updated_by)
	values (temprow."roleId",temprow."moduleId", temprow."create", temprow."read", temprow."update", temprow."delete", temprow."download", 1, now(), usrid, now(), usrid);
				  end if;

			  end loop;
			 end;	
	     return query
		 select t2.id from temp_table2 t1 inner join role_module_permissions t2
		 on t1."roleId" = t2.role_id
		 and t1."moduleId" = t2.module_id
		 and t2.is_active = 1
		 order by t2.id;		 
end;
$BODY$;

CREATE OR REPLACE FUNCTION f_add_update_group_permission(
	usrid character varying,
	permissions json)
    RETURNS TABLE("groupPermissionId" integer) 
    LANGUAGE 'plpgsql'

AS $BODY$
 declare temprow record;
begin

 		CREATE TEMP TABLE IF NOT EXISTS temp_table1 AS
        	 select * from json_populate_recordset(null::group_modules_permissions,permissions) tbl1;
			 
		CREATE TEMP TABLE IF NOT EXISTS temp_table2 AS
        	select * from temp_table1 t1 where t1."groupId" is not null and t1."moduleId" is not null;
			
			begin 
	        	for temprow in
			    	select * from temp_table2 tbl order by tbl."moduleId"
			   loop
				   if exists (select * from group_module_permissions tb where tb.group_id = temprow."groupId" and tb.module_id = temprow."moduleId") THEN
				     update group_module_permissions set 
					 "create" = temprow."create",
					 "read" = temprow."read",
					 "update" = temprow."update",
					 "delete" = temprow."delete",
					 "download" = temprow."download",
					 is_active = 1,
				     updated_by = usrid,
					 updated_at = now()
					 where group_id = temprow."groupId" and module_id = temprow."moduleId";
				   else
				   	 insert into group_module_permissions(group_id, module_id, "create", "read", "update", "delete", download, is_active, created_at, created_by, updated_at, updated_by)
	values (temprow."groupId",temprow."moduleId", temprow."create", temprow."read", temprow."update", temprow."delete", temprow."download", 1, now(), usrid, now(), usrid);
				  end if;

			  end loop;
			 end;	
	     return query
		 select t2.id from temp_table2 t1 inner join group_module_permissions t2
		 on t1."groupId" = t2.group_id
		 and t1."moduleId" = t2.module_id
		 and t2.is_active = 1
		 order by t2.id;		 
end;
$BODY$;

CREATE OR REPLACE FUNCTION f_get_clients(
	)
    RETURNS TABLE("clientId" character varying, "clientName" character varying, "clientType" integer, "clientTypeName" character varying, contact character varying, "contactPerson" character varying, "emailId" character varying, "startDate" character varying, "endDate" character varying, location character varying, address character varying, "noOfResidenceUnit" integer, "noOfResidentialUnit" integer, "noOfNonResidentialUnit" integer, "noOfFourWheelerParking" integer, "noOfTwoWheelerParking" integer, "clientLogo" character varying, "isBlocked" integer) 
    LANGUAGE 'plpgsql'

AS $BODY$
begin
				return query 
				select cl.client_id, cl.client_name, cl.client_type, clt.type_name client_type_name, cl.contact, cl.contact_person,
				cl.email_id, to_char(cl.start_date, 'DD-Mon-YYYY')::varchar start_date, to_char(cl.end_date, 'DD-Mon-YYYY')::varchar
				end_date, cl.location, cl.address, cl.no_of_residence_unit, cl.no_of_residential_unit, cl.no_of_non_residential_unit,
				cl.no_of_four_wheeler_parking, cl.no_of_two_wheeler_parking, cl.client_logo, cl.is_blocked
				from clients cl inner join client_types clt
				on cl.client_type = clt.type_id
				where cl.is_active = 1;
end;
$BODY$;
