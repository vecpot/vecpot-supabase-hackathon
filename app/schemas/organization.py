from sqlalchemy.ext.automap import automap_base

from db_engine import engine

AutoBase = automap_base()

AutoBase.prepare(engine, reflect=True, schema="public")

Organization = AutoBase.classes.organization
UserOrganization = AutoBase.classes.user_organization