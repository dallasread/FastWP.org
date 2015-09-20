            </div>
        </div>

        <footer>
            <div class="container">
                <?php dynamic_sidebar( 'footer' ); ?>

                <?php
                    wp_nav_menu(array(
                        "theme_location" => "footer",
                        "menu_id" => "footer"
                    ));
                ?>

                <?php dynamic_sidebar( 'copyright' ); ?>
            </div>
        </footer>

        <?php wp_footer(); ?>
    </body>
</html>
