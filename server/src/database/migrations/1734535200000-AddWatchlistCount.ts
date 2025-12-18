import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddWatchlistCount1734535200000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add watchlistCount column to products table
        await queryRunner.addColumn(
            'products',
            new TableColumn({
                name: 'watchlistCount',
                type: 'int',
                default: 0,
            }),
        );

        // Populate existing data by counting watchlist entries
        await queryRunner.query(`
            UPDATE products p
            SET "watchlistCount" = (
                SELECT COUNT(*)
                FROM watchlist w
                WHERE w."productId" = p.id
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop watchlistCount column
        await queryRunner.dropColumn('products', 'watchlistCount');
    }
}
