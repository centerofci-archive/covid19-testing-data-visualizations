
/**
 * for lines with gradient of 1
 */
export function compute_intercept_with_bounding_rect (y_intercept, bound_min_x, bound_max_x, bound_min_y, bound_max_y)
{
    let x1, y1, x2, y2 = undefined

    const intercept_vertical_left = intercepts_vertical(y_intercept, bound_min_x, bound_min_y, bound_max_y)
    const intercept_vertical_right = intercepts_vertical(y_intercept, bound_max_x, bound_min_y, bound_max_y)
    const intercept_horizontal_bottom = intercepts_horizontal(y_intercept, bound_min_y, bound_min_x, bound_max_x)
    const intercept_horizontal_top = intercepts_horizontal(y_intercept, bound_max_y, bound_min_x, bound_max_x)

    if (intercept_vertical_left)
    {
        // check they're not the same point on the corner
        if (intercept_horizontal_top && intercept_vertical_left.y === intercept_horizontal_top.y)
        {
            return undefined
        }

        x1 = intercept_vertical_left.x
        y1 = intercept_vertical_left.y
    }
    else if (intercept_horizontal_bottom)
    {
        // check they're not the same point on the corner
        if (intercept_horizontal_bottom && intercept_vertical_right.y === intercept_horizontal_bottom.y)
        {
            return undefined
        }

        x1 = intercept_horizontal_bottom.x
        y1 = intercept_horizontal_bottom.y
    }

    if (intercept_vertical_right)
    {
        x2 = intercept_vertical_right.x
        y2 = intercept_vertical_right.y
    }
    else
    {
        x2 = intercept_horizontal_top.x
        y2 = intercept_horizontal_top.y
    }

    return { x1, y1, x2, y2 }
}

function intercepts_vertical (y_intercept, vertical_x, vertical_min_y, vertical_max_y)
{
    let result = {
        x: undefined,
        y: vertical_x + y_intercept
    }

    if (vertical_min_y <= result.y && result.y <= vertical_max_y)
    {
        result.x = vertical_x
    }
    else
    {
        result = undefined
    }

    return result
}

function intercepts_horizontal (y_intercept, horizontal_y, horizontal_min_x, horizontal_max_x)
{
    let result = {
        x: horizontal_y - y_intercept,
        y: undefined,
    }

    if (horizontal_min_x <= result.x && result.x <= horizontal_max_x)
    {
        result.y = horizontal_y
    }
    else
    {
        result = undefined
    }

    return result
}


export function scale_line (line, x_scale, y_scale)
{
    return {
        x1: x_scale(line.x1),
        y1: y_scale(line.y1),
        x2: x_scale(line.x2),
        y2: y_scale(line.y2),
    }
}
