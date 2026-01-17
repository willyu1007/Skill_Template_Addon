# SQLAlchemy/Alembic strategy (deprecated in the template)

The template's database SSOT system is Prisma-focused.

- If you are using `schema.prisma` as SSOT, use Prisma migrations.
- If you are using the real DB as SSOT, use Prisma introspection + db-mirror.

The document is kept only as historical context and SHOULD NOT be used for new projects.
