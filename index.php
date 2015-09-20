<?php
  /*
    Template Name: Home
  */
  get_header();
?>

<?php
  $single = is_single() || is_page();
  $meta = get_post_meta($post->ID);
  $sidebar = $meta['brilliant-sidebar'] ? $meta['brilliant-sidebar'][0] : false;
?>

<div class="posts-content <?php echo $single ? "is-single" : 'is-group'; ?> <?php echo $sidebar ? "has-$sidebar-sidebar has-sidebar" : 'has-no-sidebar'; ?>">
  <div class="posts">
    <div class="loading"></div>

    <?php if ( $wp_query->have_posts() ) : while ( $wp_query->have_posts() ) : the_post(); ?>
      <?php
        $categories = get_the_category();
        $tags = get_the_tag_list('Tags: ', ',' );
      ?>

      <div class="post <?php echo has_post_thumbnail() && !$sidebar ? 'has-featured-image-bg' : ''; ?> <?php echo has_post_thumbnail() ? 'has-featured-image' : ''; ?>">

        <?php if (has_post_thumbnail()) { ?>
          <?php
              if ($sidebar) {
                 $thumb = wp_get_attachment_image_src( get_post_thumbnail_id( $post->ID ), 'full' );
          ?>
            <a href="<?php the_permalink(); ?>" class="featured-image">
                <img src="<?php echo $thumb[0]; ?>">
            </a>
          <?php } else { ?>
            <a href="<?php the_permalink(); ?>" class="featured-image-bg">
                <?php echo the_post_thumbnail( 'brilliant-blog' ); ?>
            </a>
          <?php } ?>
        <?php } ?>

        <div class="post-content">
          <?php if (!isset($meta['no-title'])) { ?>
            <h2>
              <a href="<?php the_permalink(); ?>" rel="bookmark" title="Permanent Link to <?php the_title_attribute(); ?>">
                <?php the_title(); ?>
              </a>
            </h2>

            <?php if (is_single()) { ?>
              <small>
                <?php the_author_posts_link(); ?> /
                <?php the_time('F j, Y'); ?>
              </small>
            <?php } ?>
          <?php } ?>

          <div class="content">
            <?php if ($sidebar) { ?>
              <?php the_content('', false, ''); ?>
            <?php } else { ?>
              <p class="excerpt"><?php the_excerpt('', false, ''); ?></p>
              <!-- <a href="<?php the_permalink(); ?>" class="btn btn-medium btn-invert btn-primary">
                Read More
              </a> -->
            <?php } ?>
          </div>

          <?php if (count($categories) > 0) { ?>
            <ul class="categories">
              <?php foreach ($categories as $category) {
              ?>
                <li>
                  <a href="<?php echo get_category_link( $category->term_id ); ?>" class="btn btn-medium btn-invert btn-primary">
                    <?php echo $category->name; ?>
                  </a>
                </li>
              <?php } ?>
            </ul>
          <?php } ?>

          <?php if (!empty($tags)) { ?>
            <p class="tags">
              <?php echo $tags; ?>
            </p>
          <?php } ?>

        </div>

      </div>

    <?php endwhile; else : ?>

        <div class="post">
            <h2>No <?php echo ucfirst($sidebar); ?> Posts Found</h2>
            <p>Sorry, no <?php echo $sidebar; ?> posts match your criteria.</p>
        </div>

    <?php endif; ?>
  </div>

  <?php if ($sidebar) { ?>
    <div class="sidebar">
      <?php dynamic_sidebar( $sidebar ); ?>
    </div>
  <?php } ?>
</div>


<?php get_footer(); ?>
