-- Function to get top books for a class
CREATE OR REPLACE FUNCTION public.get_class_favorite_books(p_class_name text, p_limit integer DEFAULT 5)
RETURNS TABLE(book_title text, read_count bigint)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    rl.book_title,
    COUNT(*) as read_count
  FROM reading_logs rl
  JOIN children c ON rl.child_id = c.id
  WHERE c.class_name = p_class_name
    AND rl.book_title IS NOT NULL
    AND rl.book_title != ''
  GROUP BY rl.book_title
  ORDER BY read_count DESC, rl.book_title ASC
  LIMIT p_limit;
$$;

-- Function to get top books for a grade
CREATE OR REPLACE FUNCTION public.get_grade_favorite_books(p_grade_info text, p_limit integer DEFAULT 5)
RETURNS TABLE(book_title text, read_count bigint)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    rl.book_title,
    COUNT(*) as read_count
  FROM reading_logs rl
  JOIN children c ON rl.child_id = c.id
  WHERE c.grade_info = p_grade_info
    AND rl.book_title IS NOT NULL
    AND rl.book_title != ''
  GROUP BY rl.book_title
  ORDER BY read_count DESC, rl.book_title ASC
  LIMIT p_limit;
$$;