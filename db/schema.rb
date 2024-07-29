# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2024_07_28_193207) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "actionables", force: :cascade do |t|
    t.text "action"
    t.string "status"
    t.string "subproduct"
    t.string "actionable_category"
    t.string "feedback_category"
    t.text "feedback_json"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "analytic_seeds", force: :cascade do |t|
    t.string "date"
    t.string "feedback"
    t.string "product"
    t.string "subcategory"
    t.string "sentiment"
    t.string "sentiment_score"
    t.string "source"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "analytics", id: false, force: :cascade do |t|
    t.text "date"
    t.text "feedback"
    t.string "product", limit: 50
    t.string "subcategory", limit: 500
    t.string "feedback_category", limit: 100
    t.string "sentiment", limit: 100
    t.string "sentiment_score", limit: 50
    t.string "source", limit: 100
  end

  create_table "feedbacks", force: :cascade do |t|
    t.integer "user_id"
    t.string "category"
    t.text "content"
    t.string "sentiment"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "logs", force: :cascade do |t|
    t.text "log_message"
    t.datetime "created_at", default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.datetime "updated_at", default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.string "status"
  end

  create_table "test_analytics", id: false, force: :cascade do |t|
    t.text "date"
    t.text "feedback"
    t.string "product", limit: 50
    t.string "subcategory", limit: 500
    t.string "feedback_category", limit: 100
    t.string "sentiment", limit: 100
    t.string "sentiment_score", limit: 50
    t.string "source", limit: 100
  end

  create_table "test_dataprocessing", id: false, force: :cascade do |t|
    t.text "date"
    t.text "feedback"
    t.string "product", limit: 50
    t.string "subcategory", limit: 500
    t.string "feedback_category", limit: 100
    t.string "sentiment", limit: 100
    t.string "sentiment_score", limit: 50
    t.string "source", limit: 100
  end

end
